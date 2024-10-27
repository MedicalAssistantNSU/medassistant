package pkg

import (
	"bufio"
	"io"
	"os"
	"os/exec"

	"github.com/sirupsen/logrus"
)

func Perform(path string) (string, error) {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	cmd := exec.Command("python3", "../CV/DocumentOCR.py", path)

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return "", err
	}
	err = cmd.Start()
	if err != nil {
		return "", err
	}
	go copyOutput(stderr)
	cmd.Wait()

	file, err := os.Open("processed_images/detected_text.txt")
	if err != nil {
		return "", err
	}
	defer file.Close()

	b, err := io.ReadAll(file)
	return string(b), err
}

func copyOutput(r io.Reader) {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		logrus.Info(scanner.Text())
	}
}
