package transport

import (
	"med-asis/internal/models"
	"med-asis/internal/service"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type InputMsgWithChatId struct {
	ChatId    int    `json:"chatId"`
	Content   string `json:"content"`
	Type      string `json:"type"`
	CreatedAt string `json:"createdAt"`
}

func (h *Handler) wsChat(c *gin.Context) {
	authToken := c.Param("auth")

	id, err := h.services.Authorization.ParseToken(authToken)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, "parse token failed")
		return
	}

	c.Set(UserId, id)

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Error(err.Error())
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	defer conn.Close()

	requests := make(chan InputMsgWithChatId)

	var wg sync.WaitGroup
	wg.Add(2)

	go wsReader(conn, requests, &wg)

	go goWorker(h, id, conn, requests, &wg)

	wg.Wait()
}

func wsReader(conn *websocket.Conn, requests chan<- InputMsgWithChatId, wg *sync.WaitGroup) {
	defer conn.Close()
	defer wg.Done()
	defer close(requests)
	for {
		var input InputMsgWithChatId

		if err := conn.ReadJSON(&input); err != nil {
			logrus.Error(err.Error())
			break
		}

		requests <- input
	}
}

func goWorker(h *Handler, id int, conn *websocket.Conn, requests <-chan InputMsgWithChatId, wg *sync.WaitGroup) {
	defer conn.Close()
	defer wg.Done()
	for {
		req := <-requests

		inputMsg := models.Message{
			Content:   req.Content,
			Type:      req.Type,
			CreatedAt: req.CreatedAt,
		}

		logrus.Info(inputMsg)

		chat, err := h.services.Chat.GetById(id, req.ChatId)
		if err != nil {
			logrus.Error(err.Error())
			break
		}

		inputMsg.SenderId = id
		answer, err := h.services.Message.Create(req.ChatId, service.CreateMsg{
			Msg:     inputMsg,
			History: chat.Context,
		})
		if err != nil {
			logrus.Error(err.Error())
			break
		}

		updatedChat := models.Chat{
			Name:    chat.Name,
			Context: answer.History,
		}

		logrus.Info(chat.Context)

		if err := h.services.Chat.Update(id, req.ChatId, updatedChat); err != nil {
			logrus.Error(err.Error())
			break
		}

		if err = conn.WriteJSON(answer.Msg); err != nil {
			logrus.Error(err.Error())
			break
		}
	}
}

// TODO add this
// package main

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"time"

// 	"github.com/gin-gonic/gin"
// 	"github.com/gorilla/websocket"
// 	"github.com/go-redis/redis/v8"
// 	"golang.org/x/net/context"
// )

// var ctx = context.Background()
// var redisClient *redis.Client

// // Настроим WebSocket upgrader
// var upgrader = websocket.Upgrader{
// 	CheckOrigin: func(r *http.Request) bool {
// 		return true
// 	},
// }

// // Глобальный семафор для ограничения количества параллельных запросов
// var maxConcurrentRequests = 3 // Максимальное количество параллельных запросов
// var semaphore = make(chan struct{}, maxConcurrentRequests) // Канал для семафора

// // Функция обработки запроса
// func processRequest(userID string, data string) string {
// 	// Симуляция обработки запроса
// 	time.Sleep(2 * time.Second) // Симуляция работы
// 	return fmt.Sprintf("Запрос пользователя %s обработан: %s", userID, data)
// }

// // Функция для отправки ответа клиенту через WebSocket
// func sendResponse(userID string, response string) {
// 	// Получаем WebSocket-соединение пользователя из Redis
// 	connKey := "wsConnection:" + userID
// 	connStr, err := redisClient.Get(ctx, connKey).Result()
// 	if err != nil {
// 		log.Printf("Ошибка при получении соединения из Redis для %s: %v", userID, err)
// 		return
// 	}

// 	// Создаем WebSocket-соединение с URL, если оно сохранено в Redis
// 	conn, _, err := websocket.DefaultDialer.Dial(connStr, nil)
// 	if err != nil {
// 		log.Printf("Ошибка при установке WebSocket соединения для %s: %v", userID, err)
// 		return
// 	}
// 	defer conn.Close()

// 	// Отправляем ответ через WebSocket
// 	err = conn.WriteMessage(websocket.TextMessage, []byte(response))
// 	if err != nil {
// 		log.Printf("Ошибка при отправке сообщения клиенту %s: %v", userID, err)
// 	}
// }

// // Функция для обработки WebSocket соединений
// func handleWebSocket(c *gin.Context) {
// 	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
// 	if err != nil {
// 		log.Println("Ошибка при установке WebSocket соединения:", err)
// 		return
// 	}
// 	defer conn.Close()

// 	// Получаем уникальный ID пользователя (например, userID)
// 	userID := c.DefaultQuery("userID", "defaultUserID")

// 	// Сохраняем URL WebSocket-соединения в Redis
// 	redisClient.Set(ctx, "wsConnection:"+userID, conn.LocalAddr().String(), 0) // Сохраняем URL соединения

// 	// Считываем запросы от клиента через WebSocket
// 	for {
// 		_, msg, err := conn.ReadMessage()
// 		if err != nil {
// 			log.Println("Ошибка при чтении сообщения от клиента:", err)
// 			break
// 		}

// 		// Добавляем запрос в очередь Redis для обработки
// 		go enqueueRequest(redisClient, userID, msg)
// 	}
// }

// // Функция для добавления запроса в очередь Redis
// func enqueueRequest(client *redis.Client, userID string, data []byte) {
// 	// Запрос добавляется в очередь Redis
// 	queueKey := "userQueue" // Название общей очереди
// 	err := client.RPush(ctx, queueKey, string(data)).Err()
// 	if err != nil {
// 		log.Printf("Ошибка при добавлении в очередь: %v", err)
// 		return
// 	}
// 	fmt.Printf("Запрос пользователя %s добавлен в очередь: %s\n", userID, data)

// 	// Обработка очереди и отправка результата через WebSocket
// 	processQueue(client, userID)
// }

// // Функция для обработки очереди и отправки ответа через WebSocket
// func processQueue(client *redis.Client, userID string) {
// 	queueKey := "userQueue" // Название общей очереди
// 	for {
// 		// Извлекаем запрос из очереди Redis
// 		request, err := client.LPop(ctx, queueKey).Result()
// 		if err != nil {
// 			if err == redis.Nil {
// 				// Очередь пуста
// 				time.Sleep(1 * time.Second)
// 				continue
// 			}
// 			log.Fatalf("Ошибка при извлечении из очереди: %v", err)
// 		}
// 		// Обрабатываем запрос
// 		fmt.Printf("Обрабатываем запрос пользователя %s: %s\n", userID, request)

// 		// Семафор ограничивает количество одновременно обрабатываемых запросов
// 		semaphore <- struct{}{} // Блокируем, если достигнут предел
// 		defer func() { <-semaphore }() // Освобождаем семафор после завершения обработки

// 		// Эмулируем обработку запроса
// 		response := processRequest(userID, request)

// 		// Отправляем ответ правильному клиенту через WebSocket
// 		sendResponse(userID, response)
// 	}
// }

// func main() {
// 	// Инициализация клиента Redis
// 	redisClient = redis.NewClient(&redis.Options{
// 		Addr: "localhost:6379", // Адрес Redis
// 	})
// 	defer redisClient.Close()

// 	// Инициализация Gin
// 	r := gin.Default()

// 	// Маршрут для WebSocket
// 	r.GET("/ws", handleWebSocket)

// 	// Запуск HTTP сервера
// 	log.Println("Запуск сервера на порту 8080...")
// 	log.Fatal(r.Run(":8080"))
// }
