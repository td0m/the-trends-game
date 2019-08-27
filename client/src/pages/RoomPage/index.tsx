import React, { useMemo, useEffect, useState } from "react";
import { Room } from "../../models/room";
import { Fab, colors } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

import AwaitingPlayers from "./AwaitingPlayers";
import ShowResults from "./ShowResults";
import SubmitPhrase from "./SubmitPhrase";
import ShowScores from "./ShowScores";
import useRouter from "use-react-router";
import useApi from "hooks/useApi";
import Avatar from "components/Avatar";

import ArrowForward from "@material-ui/icons/ArrowForward";
import PlayerMenu from "components/PlayerMenu";

interface PlayerMenuInfo {
  element?: any;
  playerId: string;
}

const RoomPage = () => {
  const api = useApi();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [playerMenu, setPlayerMenu] = useState<PlayerMenuInfo>({
    playerId: ""
  });

  const openPlayerMenu = (playerId: string) => (e: React.MouseEvent) => {
    setPlayerMenu({ playerId, element: e.currentTarget });
  };

  const { roomId } = router.match.params as any;

  const playerId = sessionStorage.getItem("name");

  const ws = useMemo(() => new WebSocket("ws://192.168.1.13:8080/ws"), []);
  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            roomId,
            playerId: playerId
          }
        })
      );
    };
    ws.onmessage = m => {
      const data = JSON.parse(m.data);
      setRoom(data);
      console.log(data);
    };
    ws.onclose = () => router.history.goBack();
    return () => ws.close();
  }, []);

  const closeRoom = () => {
    ws.close();
  };
  const onAction = (action: any) => {
    ws.send(JSON.stringify(action));
  };
  const onSubmit = (phrase: string) => {
    ws.send(
      JSON.stringify({
        type: "SUBMIT_PHRASE",
        payload: phrase
      })
    );
  };
  const onReady = () => {
    ws.send(
      JSON.stringify({
        type: "PLAYER_READY",
        payload: ""
      })
    );
  };

  let content = <div>loading</div>;

  if (room !== null) {
    switch (room.state) {
      case "AWAITING_PLAYERS":
        content = (
          <AwaitingPlayers
            ready={room.players[playerId!].ready}
            room={room}
            onStart={onReady}
          />
        );
        break;
      case "SUBMIT_PHRASE":
        content = <SubmitPhrase room={room} onSubmit={onSubmit} />;
        break;
      case "SHOW_RESULTS":
        content = <ShowResults room={room} />;
        break;
      case "SHOW_SCORES":
        content = <ShowScores room={room} />;
        break;
    }
  }

  return (
    <div className="app">
      <div className="container">
        {content}
        {/* <SubmitPhrase room={room} /> */}
        {/* <ShowResults room={room} /> */}
        {/* <ShowScores /> */}
      </div>
      <Fab
        onClick={closeRoom}
        size="small"
        style={{
          position: "fixed",
          top: 15,
          right: 15,
          background: colors.red[700],
          color: "white"
        }}
      >
        <Close />
      </Fab>
      <div
        style={{
          position: "fixed",
          bottom: 12,
          left: 6,
          display: "flex"
        }}
      >
        {room &&
          Object.keys(room.players).map(pid => {
            const player = room.players[pid];
            return (
              <Avatar
                onClick={openPlayerMenu(pid)}
                key={pid}
                name={pid}
                enableBorder={player.ready}
                color={
                  pid === playerId
                    ? colors.blue[100]
                    : player.online
                    ? "#ddd"
                    : colors.red[100]
                }
                textColor="dark"
              />
            );
          })}
      </div>
      {room && (room.state === "SHOW_RESULTS" || room.state === "SHOW_SCORES") && (
        <div
          style={{
            position: "fixed",
            bottom: 12,
            right: 12,
            display: "flex"
          }}
        >
          <Fab
            disabled={room ? room.players[playerId!].ready : false}
            color="primary"
            variant="extended"
            onClick={onReady}
          >
            Next
            <ArrowForward />
          </Fab>
        </div>
      )}
      <PlayerMenu
        playerId={playerMenu.playerId}
        anchorEl={playerMenu.element}
        onClose={() => setPlayerMenu({ playerId: "" })}
        onAction={onAction}
      />
    </div>
  );
};

export default RoomPage;
