package models

import "github.com/gorilla/websocket"

type Player struct {
	Name    string            `json:"name"`
	Online  bool              `json:"online"`
	Ready   bool              `json:"ready"`
	Answers map[string]Answer `json:"answers"`
	Socket  *websocket.Conn   `json:"-"`
}
