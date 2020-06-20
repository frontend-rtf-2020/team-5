package middleware

import (
	"chat/pkg/mailer"
	"chat/pkg/ws"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func ChatContext(mongoClient *mongo.Client, wsServer *ws.Server, mailer *mailer.Mailer) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("mongo", mongoClient)
		c.Set("ws", wsServer)
		c.Set("mailer", mailer)
		c.Next()
	}
}
