import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Menu,
  MenuItem
} from "@material-ui/core";

interface UserMenuDialogProps {
  playerId: string;
  onClose: () => void;
  anchorEl: Element | undefined;
  onAction: (action: any) => void;
}

const PlayerMenu = ({
  playerId,
  onClose,
  anchorEl,
  onAction
}: UserMenuDialogProps) => {
  const action = (action: any) => {
    onClose();
    onAction(action);
  };
  return (
    <Menu
      open={playerId !== ""}
      anchorEl={anchorEl}
      anchorPosition={{ top: -100, left: 0 }}
      onClose={onClose}
    >
      <MenuItem
        onClick={() => action({ type: "KICK_PLAYER", payload: playerId })}
      >
        Kick User
      </MenuItem>
    </Menu>
  );
};

export default PlayerMenu;
