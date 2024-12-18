package main

import (
	"context"
	"log"
	"med-asis/internal/models"
	"med-asis/internal/repository"

	"med-asis/internal/service"
	"med-asis/internal/transport"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/minio/minio-go"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// @title           HealthMate
// @version         1.0
// @host      localhost:8080
// @BasePath  /
// @securitydefinitions.apikey  ApiKeyAuth
// @in header
// @name Authorization
func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	if err := initConfig(); err != nil {
		logrus.Fatalf("initConfig failed: %s", err.Error())
	}

	if err := godotenv.Load(); err != nil {
		logrus.Fatalf("Load .env files failed: %s", err.Error())
	}

	accessKey := os.Getenv("S3_ACCESS_KEY")
	secretKey := os.Getenv("S3_SECRET_KEY")

	client, err := minio.New(viper.GetString("storage.endpoint"), accessKey, secretKey, false)
	if err != nil {
		log.Fatal(err)
	}

	fileStorage := repository.NewFileStorage(
		client,
		viper.GetString("storage.bucket"),
		viper.GetString("storage.endpoint"),
	)

	db, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("db.host"),
		Port:     viper.GetString("db.port"),
		Username: viper.GetString("db.user"),
		DBName:   viper.GetString("db.dbname"),
		SSLMode:  viper.GetString("db.sslmode"),
		Password: os.Getenv("POSTGRES_PASSWORD"),
	})

	if err != nil {
		logrus.Fatalf("Connection to Postgres DB failed: %s", err.Error())
	}

	repository := repository.NewRepository(db, fileStorage)
	services := service.NewService(repository)
	handlers := transport.NewHandler(services)

	services.Post.InitPosts()

	srv := new(models.ServerApi)
	go func() {
		if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
			logrus.Fatalf("srv run failed: %s", err.Error())
		}
	}()

	logrus.Print("MedAsis Started")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	logrus.Print("MedAsis Shutting Down")

	if err := srv.Shutdown(context.Background()); err != nil {
		logrus.Errorf("error occured on server shutting down: %s", err.Error())
	}

	if err := db.Close(); err != nil {
		logrus.Errorf("error occured on db connection close: %s", err.Error())
	}
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}
