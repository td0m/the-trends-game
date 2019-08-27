import React from "react";
import { Room, Player } from "models/room";
import {
  Typography as T,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Badge
} from "@material-ui/core";
import CountUp from "react-countup";

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
        {Object.keys(room.players)
          .sort((a, b) => {
            return getScore(room.players[b]) - getScore(room.players[a]);
          })
          .map((k, i) => {
            const player = room.players[k];
            return (
              <ListItem key={k}>
                <ListItemText primary={player.name} />
                <ListItemSecondaryAction>
                  <CountUp start={0} end={getScore(player)} duration={1} />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default ShowScores;
