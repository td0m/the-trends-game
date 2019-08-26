package models

type Answer struct {
	Phrase string `json:"phrase"`
	Score int `json:"score"`
	History []int `json:"history"`
}