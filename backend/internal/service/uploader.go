package service

import (
	"context"
	"io"
	"med-asis/internal/repository"

	"golang.org/x/exp/rand"
)

const (
	letterBytes    = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	fileNameLength = 16
)

type UploaderService struct {
	fs *repository.FileStorage
}

func NewUpdoaderService(fs *repository.FileStorage) *UploaderService {
	return &UploaderService{
		fs: fs,
	}
}

func (u *UploaderService) Upload(ctx context.Context, file io.Reader, size int64, contentType string) (string, error) {
	return u.fs.Upload(ctx, repository.UploadInput{
		File:        file,
		Name:        generateFileName(),
		Size:        size,
		ContentType: contentType,
	})
}

func generateFileName() string {
	b := make([]byte, fileNameLength)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}
