import React, { useState } from "react";
import { Typography as T, TextField, colors } from "@material-ui/core";
import { Room } from "models/room";

const validator = (rawInput: string, word: string, room: Room): string => {
  if (rawInput.length === 0) return "";

  const input = rawInput.toLowerCase().trim();

  if (input.indexOf(word) === -1)
    return `You need to include "${word}" in your phrase.`;
  if (input.split(" ").length < 2)
    return `You need to include at least two words in your phrase.`;
  for (let key in room.players) {
    const player = room.players[key];
    const answer = player.answers[word];
    if (answer && answer.phrase === input) {
      return `Someone already submitted that phrase.`;
    }
  }

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
