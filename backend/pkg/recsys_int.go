package pkg

import (
	"os/exec"
	"strings"

	"github.com/sirupsen/logrus"
)

func GetRecs(embedding string) (string, error) {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	cmd := exec.Command("python3", "../recsys/recommended.py", "--embedding", embedding)

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
