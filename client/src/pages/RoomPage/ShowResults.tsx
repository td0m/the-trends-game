import React from "react";
import { Room } from "models/room";
import {
  Typography as T,
  List,
  ListItemText,
  ListItem,
  ListItemSecondaryAction
} from "@material-ui/core";
import CountUp from "react-countup";

const ShowResults = ({ room }: { room: Room }) => {
  return (
    <>
      <T variant="subtitle1">RESULTS</T>
      <T variant="h3">{room.currentKeyword}</T>
      <div style={{ height: 20 }}></div>
      <div>
        <List>
          {Object.keys(room.players).map(pk => {
            const player = room.players[pk];
            const answer = player.answers[room.currentKeyword];
            if (!answer)
              return (
                <div key={pk}>
                  empty {room.currentKeyword} {pk}
                </div>
              );
            return (
              <ListItem key={pk}>
                <ListItemText primary={answer.phrase} secondary={player.name} />
                <ListItemSecondaryAction>
                  <CountUp start={0} end={answer.score} duration={0.8} />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    </>
  );
};

export default ShowResults;
