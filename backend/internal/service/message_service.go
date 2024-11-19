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

type CreateMsg struct {
	Msg     models.Message
	History string
}

func (i *MessageService) Create(chat_id int, msg CreateMsg) (*CreateMsg, error) {
	_, err := i.repo.Create(chat_id, msg.Msg)
	if err != nil {
		return nil, err
	}

	var output map[string]string

	response := msg.Msg
	response.SenderId = 0
	response.Type = "text"

	if msg.Msg.Type == "image" {
		path := "../"
		flpath := path + filepath.Base(msg.Msg.Content)
		if err := DownloadFile(flpath, msg.Msg.Content); err != nil {
			response.Content = "Не удалось загрузить файл."
		}
		defer os.Remove(flpath)

		out, err := pkg.RunTask(pkg.TaskConfig{
			TaskType: "ocr",
			Value:    flpath,
			UserId:   fmt.Sprintf("%d", msg.Msg.SenderId),
			ChatId:   fmt.Sprintf("%d", chat_id),
			History:  msg.History,
		})

		if err != nil {
			response.Content = err.Error()
		} else {
			if err := json.Unmarshal([]byte(out), &output); err != nil {
				response.Content = err.Error()
			} else {
				response.Content = output["answer"]
			}
			logrus.Info(out)
		}
	} else {
		out, err := pkg.RunTask(pkg.TaskConfig{
			TaskType: "chat",
			Value:    msg.Msg.Content,
			UserId:   fmt.Sprintf("%d", msg.Msg.SenderId),
			ChatId:   fmt.Sprintf("%d", chat_id),
			History:  msg.History,
		})

		if err != nil {
			response.Content = err.Error()
		} else {
			if err := json.Unmarshal([]byte(out), &output); err != nil {
				response.Content = err.Error()
			} else {
				response.Content = output["answer"]
			}
			logrus.Info("HISTORY", output["history"])
			logrus.Info("ANSWER", output["answer"])
		}
	}

	id, err := i.repo.Create(chat_id, response)
	if err != nil {
		return nil, err
	}

	newMsg, err := i.repo.GetMsgById(id)

	return &CreateMsg{
		Msg:     newMsg,
		History: output["history"],
	}, err
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
