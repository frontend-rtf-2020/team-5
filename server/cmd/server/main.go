package main

import (
	"chat/pkg/mailer"
	"chat/pkg/middleware"
	views "chat/pkg/views/chat"
	"chat/pkg/ws"
	"context"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"time"
)


func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func main() {
	mongoClient, err := mongo.NewClient(options.Client().ApplyURI(getenv("MONGO_DSN", "mongodb://****:******@cluster0-shard-00-00-umdsr.mongodb.net:27017,cluster0-shard-00-01-umdsr.mongodb.net:27017,cluster0-shard-00-02-umdsr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority")))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = mongoClient.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	wsServer := ws.NewServer(mongoClient)
	mailerClient := mailer.NewMailer(
		getenv("MAIL_LOGIN", "noreply@rtf17.ru"),
		getenv("MAIL_PASSWORD", "*********"),
		getenv("MAIL_SERVER", "smtp.timeweb.ru"),
		)



	log.Info("ddsd")
	r := gin.Default()
	r.Use(middleware.ChatContext(mongoClient, wsServer, &mailerClient), middleware.Cors())
	r.POST("/login", views.Login)
	r.POST("/register", views.Register)
	r.POST("/create_chat", views.CreateChat)
	r.POST("/search_users", views.SearchUsers)
	r.POST("/send_message", views.SendMessage)
	r.POST("/chat_list", views.ChatsList)
	r.POST("/chat_info", views.ChatInfo)
	r.POST("/chat_infos", views.ChatInfos)
	r.POST("/get_messages", views.GetMessages)
	r.POST("/view_message", views.MarkAsRead)
	r.POST("/is_valid_token", views.IsValidToken)
	r.POST("/confirm_account", views.ConfirmAccount)

	//WS

	r.GET("/", views.WebSocket)

	go wsServer.Listen()
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
