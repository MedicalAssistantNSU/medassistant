package service

import (
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

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
