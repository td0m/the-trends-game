package main

import (
	"time"

	"github.com/d0minikt/the-trends-game/api"
	"github.com/d0minikt/the-trends-game/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func autoDeleteRooms() {
	for {
		time.Sleep(time.Minute * 3)
		for _, k := range api.Rooms.Keys() {
			raw, _ := api.Rooms.Get(k)
			room := raw.(models.Room)
			onlinePlayerCount := len(api.GetOnlinePlayers(room))
			if onlinePlayerCount == 0 {
				api.Rooms.Remove(k)
			}
		}
	}
}

func main() {
	go autoDeleteRooms()

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/categories", api.GetCategories)
	r.GET("/api/rooms", api.GetRooms)
	r.POST("/api/rooms/:id", api.CreateRoom)

	r.GET("/ws", func(c *gin.Context) {
		api.WsHandler(c.Writer, c.Request)
	})

	r.Run()
}
