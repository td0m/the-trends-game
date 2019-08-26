package api

type JoinRoom struct {
	RoomID string `json:"roomId"`
	PlayerID string `json:"playerId"`
}

type JoinRoomAction struct {
	Type    string   `json:"type"`
	Payload JoinRoom `json:"payload"`
}

// Action struct
type Action struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}