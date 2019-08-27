package api

import (
	"net/http"

	"github.com/d0minikt/the-trends-game/lib"
	"github.com/d0minikt/the-trends-game/models"
	"github.com/gin-gonic/gin"

	cmap "github.com/orcaman/concurrent-map"
)

var Rooms = cmap.New()

func GetCategories(c *gin.Context) {
	c.JSON(200, lib.GetCategories())
}

func GetRooms(c *gin.Context) {
	publicRooms := []models.RoomSummary{}

	// only return public rooms
	for _, roomID := range Rooms.Keys() {
		raw, ok := Rooms.Get(roomID)
		if ok {
			room := raw.(models.Room)

			// count players
			playerCount := 0
			for _, key := range room.Players.Keys() {
				raw, _ := room.Players.Get(key)
				p := raw.(models.Player)
				if p.Online {
					playerCount++
				}
			}

			if room.Public {
				publicRooms = append(publicRooms, models.RoomSummary{
					ID:          roomID,
					Name:        room.Name,
					PlayerCount: playerCount,
				})
			}
		}
	}

	c.JSON(200, publicRooms)
}

func CreateRoom(c *gin.Context) {
	id := c.Param("id")
	body := models.Room{}
	if err := c.ShouldBind(&body); err != nil {
		c.String(400, "invalid body, "+err.Error())
		return
	}
	if _, ok := Rooms.Get(id); ok {
		c.String(401, "room already exists")
		return
	}
	if len(body.Categories) == 0 {
		body.Categories = lib.GetCategories()
	}
	body.ID = id
	body.State = "AWAITING_PLAYERS"
	body.Players = cmap.New()
	Rooms.Set(id, body)

	c.JSON(http.StatusOK, body)
}
