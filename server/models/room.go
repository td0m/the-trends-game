package models

import (
	cmap "github.com/orcaman/concurrent-map"
)

type Room struct {
	ID         string   `json:"id"`
	Name       string   `json:"name" binding:"required"`
	Public     bool     `json:"public"`
	Categories []string `json:"categories"`

	State          string             `json:"state"`
	CurrentKeyword string             `json:"currentKeyword"`
	KeywordsUsed   []string           `json:"-"`
	Players        cmap.ConcurrentMap `json:"players"`
}

type RoomSummary struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	PlayerCount int    `json:"playerCount"`
}
