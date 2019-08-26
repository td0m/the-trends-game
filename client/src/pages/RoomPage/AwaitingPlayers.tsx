import React from "react";
import {
  Typography as T,
  List,
  Paper,
  ListItem,
  ListItemText,
  Fab,
  Badge
} from "@material-ui/core";
import { Room } from "../../models/room";

import PlayArrow from "@material-ui/icons/PlayArrow";

const AwaitingPlayers = ({
  room,
  onStart,
  ready
}: {
  room: Room;
  onStart: () => void;
  ready: boolean;
}) => {
  const startGame = () => {
    onStart();
  };
  const playersOnline = Object.keys(room.players)
    .map(k => room.players[k])
    .filter(p => p.online);

  return (
    <>
      <T variant="h3">{room.name}</T>
      <T variant="subtitle1">{room.id}</T>
      <br />

      <Badge color="primary" badgeContent={Object.keys(room.players).length}>
        <T variant="subtitle1">PLAYERS</T>
      </Badge>
      <List>
        <Paper style={{ marginTop: 5 }}>
          {playersOnline.map(p => (
            <ListItem key={p.name}>
              <ListItemText primary={p.name} />
            </ListItem>
          ))}
        </Paper>
      </List>

      <Fab
        disabled={playersOnline.length < 2 || ready}
        onClick={startGame}
        // disabled={Object.keys(room.session.players).length < 2}
        color="primary"
        style={{ position: "fixed", bottom: 15, right: 15 }}
      >
        <PlayArrow />
      </Fab>
    </>
  );
};
export default AwaitingPlayers;
