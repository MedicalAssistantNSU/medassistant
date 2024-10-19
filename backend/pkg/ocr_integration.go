package pkg

import (
	"bufio"
	"fmt"
	"io"
	"os/exec"

	"github.com/sirupsen/logrus"
)

func Perform() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	cmd := exec.Command("python3", "CV/DocumentOCR.py", "CV/images.jpeg")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		panic(err)
	}
	err = cmd.Start()
	if err != nil {
		panic(err)
	}
	go copyOutput(stdout)
	go copyOutput(stderr)
	cmd.Wait()
}

func copyOutput(r io.Reader) {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}
}
