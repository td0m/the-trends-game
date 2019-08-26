package main

import (
	"github.com/d0minikt/the-trends-game/api"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
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
