package service

import (
	"encoding/json"
	"io"
	"math/rand/v2"
	"med-asis/internal/models"
	"med-asis/internal/repository"
	"med-asis/pkg"
	"os"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

const (
	medicalArticles = "initial_data/medical_articles.json"
	medicalPreviews = "initial_data/medical_preview.json"
)

type ArticleInput struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Author  string `json:"author"`
	Date    string `json:"date"`
}

type PostService struct {
	postRepo repository.PostRepository
}

func NewPostService(postRepo repository.PostRepository) *PostService {
	return &PostService{
		postRepo: postRepo,
	}
}

func (p *PostService) Create(post models.Post) (int, error) {
	return p.postRepo.Create(post)
}

func (p *PostService) GetRecs(userEmbeddig string) ([]models.Post, error) {
	if len(userEmbeddig) == 0 {
		userEmbeddig = createStartEmbedding()
	}
	rescString, err := pkg.GetRecs(userEmbeddig)
	if err != nil {
		logrus.Errorf("failed on getting recs: %s", err.Error())
		return nil, err
	}

	logrus.Info(rescString)

	result := strings.Split(rescString, ",")

	recommnededPosts := make([]models.Post, 0)

	for i := 0; i < len(result); i++ {
		id, _ := strconv.Atoi(result[i])
		recPost, err := p.GetById(id)
		if err == nil {
			recommnededPosts = append(recommnededPosts, recPost)
		}
	}

	return recommnededPosts, nil
}

func (p *PostService) GetAll() ([]models.Post, error) {
	return p.postRepo.GetAll()
}

func (p *PostService) GetById(id int) (models.Post, error) {
	return p.postRepo.GetById(id)
}

func (p *PostService) Delete(id int) error {
	return p.postRepo.Delete(id)
}

func (p *PostService) Update(id int, updatedPost models.Post) error {
	return p.postRepo.Update(id, updatedPost)
}

func (p *PostService) InitPosts() {
	exists, _ := p.GetAll()
	if len(exists) > 0 {
		return
	}

	articlesFile, err := os.Open(medicalArticles)
	if err != nil {
		logrus.Fatalf("failed on load articles")
	}
	defer articlesFile.Close()

	buf1, _ := io.ReadAll(articlesFile)

	var articles []ArticleInput

	if err = json.Unmarshal(buf1, &articles); err != nil {
		logrus.Fatalf("failed on unmarshalling articles")
	}

	previewImagesFile, err := os.Open(medicalPreviews)
	if err != nil {
		logrus.Fatalf("failed on load previews")
	}
	defer previewImagesFile.Close()

	buf2, err := io.ReadAll(previewImagesFile)
	if err != nil {
		logrus.Fatalf("read data from preview file %s", err.Error())
	}

	var images []string

	if err = json.Unmarshal(buf2, &images); err != nil {
		logrus.Fatalf("failed on unmarshalling images: %s", err.Error())
	}

	for i := 0; i < len(articles); i++ {

		previewText := truncateText(articles[i].Content, 100)
		photo := ""
		if len(images) > 0 {
			photo = images[rand.IntN(len(images)-1)]
		}
		p.Create(models.Post{
			Title:       articles[i].Title,
			Description: previewText,
			Content:     articles[i].Content,
			PublishedAt: articles[i].Date,
			ImageURL:    photo,
		})
	}
}

func truncateText(s string, max int) string {
	if max > len(s) {
		return s
	}
	return s[:strings.LastIndex(s[:max], " ")]
}

func createStartEmbedding() string {
	var sb strings.Builder

	for i := 0; i < 312; i++ {
		sb.WriteString("0")
		if i != 311 {
			sb.WriteString(",")
		}
	}

	return sb.String()
}
