package pkg

import (
	"encoding/json"
	"med-asis/internal/models"
	"os/exec"
	"strings"

	"github.com/sirupsen/logrus"
)

type TaskConfig struct {
	UserEmbedding string
	Prompt        string
	FilePath      string
	UserId        string
	ChatId        string
	History       string
	Profile       *models.UserProfile
}

func RunTask(cfg TaskConfig) (string, error) {
	logrus.SetFormatter(new(logrus.JSONFormatter))
	commandArr := []string{"../inference.py", cfg.UserId, cfg.ChatId,
		"--history", cfg.History, "--user_embedding", cfg.UserEmbedding, "--prompt", cfg.Prompt}

	if cfg.Profile != nil {
		info, err := json.Marshal(cfg.Profile)
		if err == nil {
			commandArr = append(commandArr, "--info", string(info))
		}
	}

	if cfg.FilePath != "" {
		commandArr = append(commandArr, "--image_path", cfg.FilePath)
	}
	cmd := exec.Command("python3", commandArr...)

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return "", err
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return "", err
	}

	err = cmd.Start()
	if err != nil {
		return "", err
	}

	var sb strings.Builder

	go copyOutputInBuffer(stdout, &sb)
	go copyOutput(stderr)
	cmd.Wait()

	return sb.String(), err
}
