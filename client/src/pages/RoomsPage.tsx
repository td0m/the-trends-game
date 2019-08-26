import React, { useState, useCallback, useEffect } from "react";
import {
  Typography as T,
  Fab,
  Paper,
  List,
  ListItemText,
  ListItem,
  ListItemSecondaryAction
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateRoomDialog from "../components/CreateRoomDialog";
import useApi from "hooks/useApi";
import useReactRouter from "use-react-router";
import InputNameDialog from "components/InputNameDialog";

const RoomsPage: React.FC = () => {
  const api = useApi();
  const router = useReactRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [room, setRoom] = useState("");

  const closeNameDialog = () => setRoom("");

  useEffect(() => {
    api.fetchRooms();
  }, []);

  const open = useCallback(() => setOpenDialog(true), []);
  const close = useCallback(() => setOpenDialog(false), []);

  const joinRoom = (roomId: string) => {
    setRoom(roomId);
  };

  return (
    <div className="app center">
      <div className="container">
        <T variant="h4">Rooms</T>
        <Paper>
          <List>
            {api.rooms.map(r => (
              <ListItem key={r.id} dense button onClick={() => joinRoom(r.id)}>
                <ListItemText primary={r.name} secondary={r.id} />
                <ListItemSecondaryAction>
                  <span style={{ fontSize: "0.85rem" }}>{`${
                    r.playerCount
                  } player${r.playerCount !== 1 ? "s" : ""}`}</span>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
      <Fab
        onClick={open}
        color="primary"
        style={{ position: "fixed", bottom: 15, right: 15 }}
      >
        <AddIcon />
      </Fab>
      <CreateRoomDialog open={openDialog} onClose={close} />
      <InputNameDialog
        open={room.length > 0}
        room={room}
        onClose={closeNameDialog}
      />
    </div>
  );
};

export default RoomsPage;
