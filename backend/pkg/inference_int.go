package pkg

import (
	"os/exec"
	"strings"

	"github.com/sirupsen/logrus"
)

type TaskConfig struct {
	TaskType string
	Value    string
}

func RunTask(cfg TaskConfig) (string, error) {
	logrus.SetFormatter(new(logrus.JSONFormatter))
	var cmd *exec.Cmd

	if cfg.TaskType == "ocr" {
		cmd = exec.Command("python3", "../inference.py", "--task", cfg.TaskType, "--image_path", cfg.Value)
	} else {
		cmd = exec.Command("python3", "../inference.py", "--task", cfg.TaskType, "--prompt", cfg.Value)
	}

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
