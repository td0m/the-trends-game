package lib

import "strings"

func IsValidPhrase(rawInput, rawWord string) bool {
	if len(rawInput) == 0 {
		return false
	}

	input := strings.ToLower(rawInput)
	word := strings.ToLower(rawWord)

	if !strings.Contains(input, word) {
		return false
	}
	if len(strings.Split(input, " ")) < 2 {
		return false
	}

	return true
}
