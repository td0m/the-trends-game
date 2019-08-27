package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/d0minikt/the-trends-game/lib"
	"github.com/d0minikt/the-trends-game/models"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	// allow cross-origin
	CheckOrigin: func(r *http.Request) bool { return true },
}

func getRoom(roomID string) models.Room {
	raw, _ := Rooms.Get(roomID)
	room := raw.(models.Room)
	return room
}

func notifyRoom(roomID string) {
	room := getRoom(roomID)
	for _, key := range room.Players.Keys() {
		raw, ok := room.Players.Get(key)
		if ok {
			player := raw.(models.Player)
			// only notify players that are online
			if player.Online {
				player.Socket.WriteJSON(room)
			}
		}
	}
}

func allUsersReady(room models.Room) bool {
	for _, key := range room.Players.Keys() {
		rawPlayer, _ := room.Players.Get(key)
		player := rawPlayer.(models.Player)
		if !player.Ready {
			return false
		}
	}
	return true
}

func unreadyAll(room models.Room) {
	for _, key := range room.Players.Keys() {
		rawPlayer, _ := room.Players.Get(key)
		player := rawPlayer.(models.Player)
		player.Ready = false
		room.Players.Set(key, player)
	}
	Rooms.Set(room.ID, room)
}

// todo: use this function to possibly update state if all users are ready
func updateState(room models.Room) {
	ready := allUsersReady(room)
	if ready {

		switch room.State {
		case "SHOW_SCORES":
			fallthrough
		case "AWAITING_PLAYERS":
			unreadyAll(room)
			if room.Players.Count() >= 2 {
				room.State = "SUBMIT_PHRASE"
				room.CurrentKeyword = lib.GetKeyword(room.KeywordsUsed, room.Categories)
				room.KeywordsUsed = append(room.KeywordsUsed, room.CurrentKeyword)
				Rooms.Set(room.ID, room)
			}
			break
		case "SUBMIT_PHRASE":
			unreadyAll(room)
			room.State = "SHOW_RESULTS"

			players := []string{}
			phrases := []string{}
			for _, playerID := range room.Players.Keys() {
				raw, ok := room.Players.Get(playerID)
				if ok {
					player := raw.(models.Player)
					phrase := player.Answers[room.CurrentKeyword].Phrase
					players = append(players, playerID)
					phrases = append(phrases, phrase)
				}
			}
			results, err := lib.GetTrends(phrases)
			if err != nil {
				log.Println(phrases)
			} else {
				for i, score := range results {
					playerID := players[i]
					log.Println("", playerID, score)
					rawPlayer, _ := room.Players.Get(playerID)
					player := rawPlayer.(models.Player)
					player.Answers[room.CurrentKeyword] = models.Answer{
						Score:  score,
						Phrase: phrases[i],
					}
					room.Players.Set(playerID, player)
				}
			}

			Rooms.Set(room.ID, room)
			break
		case "SHOW_RESULTS":
			unreadyAll(room)
			room.State = "SHOW_SCORES"
			Rooms.Set(room.ID, room)
			break
		}
	}
	notifyRoom(room.ID)
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer socket.Close()

	roomID := ""
	playerID := ""

	for {
		_, msg, err := socket.ReadMessage()
		if err != nil {
			// handle disconnect
			rawRoom, ok := Rooms.Get(roomID)
			if ok {
				room := rawRoom.(models.Room)
				rawPlayer, playerFound := room.Players.Get(playerID)
				if playerFound {
					player := rawPlayer.(models.Player)
					player.Online = false
					player.Ready = true // prevent offline players from blocking the game

					room.Players.Set(playerID, player)
					Rooms.Set(roomID, room)

					// todo: remove player object if no answers

					// check if the room is not empty
					atLeastOneUserConnected := false
					for _, key := range room.Players.Keys() {
						rawPlayer, _ := room.Players.Get(key)
						player := rawPlayer.(models.Player)
						if player.Online {
							atLeastOneUserConnected = true
						}
					}

					// empty/unused rooms get deleted
					if !atLeastOneUserConnected {
						// commented the next line out just for development purposes
						// Rooms.Remove(roomID)
					} else {
						// if other users still connected, notify them about the user being removed
						updateState(room)
					}
				}
			}
			break
		}

		action := Action{}
		json.Unmarshal(msg, &action)

		switch action.Type {
		case "JOIN_ROOM":
			// parse payload
			joinRoomAction := JoinRoomAction{}
			json.Unmarshal(msg, &joinRoomAction)

			roomID = joinRoomAction.Payload.RoomID
			playerID = joinRoomAction.Payload.PlayerID

			rawRoom, ok := Rooms.Get(roomID)
			if ok {
				room := rawRoom.(models.Room)

				rawPlayer, playerExists := room.Players.Get(playerID)
				// user reconnected
				if playerExists {
					player := rawPlayer.(models.Player)
					player.Socket = socket
					player.Online = true
					player.Ready = false
					room.Players.Set(playerID, player)
				} else { // new user
					room.Players.Set(playerID, models.Player{
						Name:    playerID,
						Socket:  socket,
						Online:  true,
						Ready:   false,
						Answers: map[string]models.Answer{},
					})
				}
				// let everyone know a new user connected
				notifyRoom(roomID)
			} else {
				// failed to join room, close socket
				socket.Close()
			}
			break
		// todo: merge to ready
		case "SUBMIT_PHRASE":
			raw, ok := Rooms.Get(roomID)
			if ok {
				room := raw.(models.Room)
				phrase := strings.ToLower(action.Payload)
				rawPlayer, ok := room.Players.Get(playerID)
				if ok {
					player := rawPlayer.(models.Player)
					player.Ready = true
					player.Answers[room.CurrentKeyword] = models.Answer{
						Score:  0,
						Phrase: phrase,
					}
					room.Players.Set(playerID, player)
					Rooms.Set(roomID, room)
					updateState(room)
				}
			}
			break

		case "PLAYER_READY":
			raw, ok := Rooms.Get(roomID)
			if ok {
				room := raw.(models.Room)
				if room.State != "SUBMIT_PHRASE" {
					rawPlayer, _ := room.Players.Get(playerID)
					player := rawPlayer.(models.Player)
					player.Ready = true
					room.Players.Set(playerID, player)
					Rooms.Set(roomID, room)

					// todo: call function that possibly updates state
					updateState(room)
				}
			}
			break
		}
	}
}
