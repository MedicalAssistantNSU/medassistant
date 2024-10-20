package transport

import (
	_ "med-asis/docs"
	"med-asis/internal/service"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Handler struct {
	services *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{services: service}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	auth := router.Group("/auth")
	{
		auth.POST("/sign-up", h.signUp)
		auth.POST("/sign-in", h.signIn)
	}

	api := router.Group("/api/v1", h.userIdentity)
	{
		chats := api.Group("/chats")
		{
			chats.POST("/", h.createChat)
			chats.GET("/", h.getAllChats)
			chats.GET("/:id", h.getChatById)
			chats.PUT("/:id", h.updateChat)
			chats.DELETE("/:id", h.deleteChat)
		}
	}

	return router
}
