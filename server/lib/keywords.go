package lib

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

var data DataFile

func init() {
	data = getData()
}

type DataFile struct {
	Phrases map[string][]string `json:"phrases"`
}

func getData() DataFile {
	jsonFile, err := os.Open("data.json")
	if err != nil {
		panic(err)
	}
	defer jsonFile.Close()

	bytes, _ := ioutil.ReadAll(jsonFile)
	data := DataFile{}
	json.Unmarshal(bytes, &data)
	return data
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func containsAny(list, sub []string) bool {
	for _, item := range list {
		for _, subItem := range sub {
			if item == subItem {
				return true
			}
		}
	}
	return false
}

func GetKeyword(usedKeywords, desiredCategories []string) string {
	// go gives keys from a map in random order, meaning we don't need to shuffle the keys array
	for phrase := range data.Phrases {
		categories := data.Phrases[phrase]
		if !contains(usedKeywords, phrase) && containsAny(desiredCategories, categories) {
			return phrase
		}
	}
	return "_"
}

func GetCategories() []string {
	categories := []string{}
	for phrase := range data.Phrases {
		phraseCategories := data.Phrases[phrase]
		for _, c := range phraseCategories {
			if !contains(categories, c) {
				categories = append(categories, c)
			}
		}
	}
	return categories
}
