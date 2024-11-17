package service

import (
	"encoding/json"
	"fmt"
	"io"
	"med-asis/internal/models"
	"med-asis/internal/repository"
	"med-asis/pkg"
	"net/http"
	"os"
	"path/filepath"

	"github.com/sirupsen/logrus"
)

type MessageService struct {
	repo repository.MessageRepository
}

func NewMessageService(repo repository.MessageRepository) *MessageService {
	return &MessageService{
		repo: repo,
	}
}

type InferenceJSON struct {
	Answer  string
	History string
}

func (i *MessageService) Create(chat_id int, msg models.Message) (models.Message, error) {
	_, err := i.repo.Create(chat_id, msg)
	if err != nil {
		return models.Message{}, err
	}

	var output map[string]string

	response := msg
	response.SenderId = 0
	response.Type = "text"

	if msg.Type == "image" {
		path := "../"
		flpath := path + filepath.Base(msg.Content)
		if err := DownloadFile(flpath, msg.Content); err != nil {
			response.Content = "Не удалось загрузить файл."
		}
		defer os.Remove(flpath)

		out, err := pkg.RunTask(pkg.TaskConfig{
			TaskType: "ocr",
			Value:    flpath,
			UserId:   fmt.Sprintf("%d", msg.SenderId),
			ChatId:   fmt.Sprintf("%d", chat_id),
		})

		if err != nil {
			response.Content = err.Error()
		} else {
			if err := json.Unmarshal([]byte(out), &output); err != nil {
				response.Content = err.Error()
			} else {
				response.Content = output["history"]
			}
			logrus.Info(out)
		}
	} else {
		out, err := pkg.RunTask(pkg.TaskConfig{
			TaskType: "chat",
			Value:    msg.Content,
			UserId:   fmt.Sprintf("%d", msg.SenderId),
			ChatId:   fmt.Sprintf("%d", chat_id),
		})

		if err != nil {
			response.Content = err.Error()
		} else {
			if err := json.Unmarshal([]byte(out), &output); err != nil {
				response.Content = err.Error()
			} else {
				response.Content = output["history"]
			}
			logrus.Info(output)
			logrus.Info(out)
		}
	}

	id, err := i.repo.Create(chat_id, response)
	if err != nil {
		return models.Message{}, err
	}

	return i.repo.GetMsgById(id)
}

func (i *MessageService) GetAll(user_id, chat_id int) ([]models.Message, error) {
	return i.repo.GetAll(chat_id)
}

func (i *MessageService) GetScans(user_id int) ([]models.Message, error) {
	return i.repo.GetScans(user_id)
}

func (i *MessageService) GetItemById(user_id, message_id int) (models.Message, error) {
	return i.repo.GetItemById(user_id, message_id)
}

func (i *MessageService) Delete(user_id, message_id int) error {
	return i.repo.Delete(user_id, message_id)
}

func (i *MessageService) Update(user_id, message_id int, updatedMsg models.Message) error {
	return i.repo.Update(user_id, message_id, updatedMsg)
}

func DownloadFile(filepath string, url string) error {

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	return err
}
