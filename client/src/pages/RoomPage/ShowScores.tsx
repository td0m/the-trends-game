import React from "react";
import { Room, Player } from "models/room";
import {
  Typography as T,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import CountUp from "components/CountUp";

const getScore = (player: Player): number => {
  let total = 0;
  for (let key in player.answers) {
    const answer = player.answers[key];
    total += answer.score;
  }
  return total;
};

const ShowScores = ({ room }: { room: Room }) => {
  return (
    <div>
      <T variant="h3">Scores</T>
      <List>
        {Object.keys(room.players).map(k => {
          const player = room.players[k];
          return (
            <ListItem key={k}>
              <ListItemText primary={player.name} />
              <ListItemSecondaryAction>
                <CountUp tick={6} value={getScore(player)} />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default ShowScores;
