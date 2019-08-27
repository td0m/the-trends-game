import React, { useState } from "react";
import { Typography as T, TextField, colors } from "@material-ui/core";
import { Room } from "models/room";

const pronouns = [
  "i",
  "you",
  "he",
  "she",
  "it",
  "they",
  "we",

  "me",
  "him",
  "her",

  "my",
  "mine",
  "your",
  "yours",
  "his",
  "her",
  "hers",
  "its",

  "who",
  "whom",
  "whos",
  "whose",
  "what",
  "which"
];

const banned = [
  "to",
  "is",
  "are",
  "best",
  "bad",
  "good",
  "top",
  "the",
  "a",
  "an",
  "im",
  "i'm",
  "am",
  "not",
  "of",
  "for",
  "can"
];

const isAnagram = (inputA: string, inputB: string): boolean => {
  const a = inputA
    .toLowerCase()
    .trim()
    .split(" ");
  const b = inputB
    .toLowerCase()
    .trim()
    .split(" ");

  if (a.length !== b.length) return false;

  for (let word of a) {
    if (b.indexOf(word) === -1) return false;
  }
  return true;
};

const validator = (rawInput: string, keyphrase: string, room: Room): string => {
  if (rawInput.length === 0) return "";

  const input = rawInput.toLowerCase().trim();
  const words = input.split(" ");
  const index = input.indexOf(keyphrase);

  if (index === -1) return `You need to include "${keyphrase}" in your phrase.`;
  if (words.length < 2)
    return `You need to include at least two words in your phrase.`;
  for (let key in room.players) {
    const player = room.players[key];
    const answer = player.answers[keyphrase];
    if (answer && isAnagram(input, answer.phrase)) {
      return `Someone already submitted that phrase.`;
    }
  }

  const withoutKeyphrase =
    input.slice(0, index) +
    input.slice(index + keyphrase.length + 1, input.length);
  const leftoverWords = withoutKeyphrase
    .trim()
    .split(" ")
    .filter(
      word => pronouns.indexOf(word) === -1 && banned.indexOf(word) === -1
    );

  if (leftoverWords.length === 0)
    return `Your phrase is too general and only includes pronouns and or short common words`;

  return "";
};

const SubmitPhrase = ({
  room,
  onSubmit: onSubmitCallback
}: {
  room: Room;
  onSubmit: (s: string) => void;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInput(value);
    setError(validator(value, room.currentKeyword, room));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error === "") {
      setDisabled(true);
      onSubmitCallback(input);
    }
  };

  return (
    <div>
      <T variant="subtitle1">CURRENT WORD</T>
      <T variant="h3">{room.currentKeyword}</T>
      <br />
      <form onSubmit={onSubmit}>
        <TextField
          spellCheck={false}
          disabled={disabled}
          value={input}
          variant="outlined"
          fullWidth
          label="Your Phrase"
          placeholder="Use any phrase that includes the word above"
          onChange={onInputChange}
          error={error.length > 0}
        />
        <div style={{ color: colors.red[600], margin: 4 }}>{error}</div>
      </form>
    </div>
  );
};

export default SubmitPhrase;
