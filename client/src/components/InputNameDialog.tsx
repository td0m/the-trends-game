import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField
} from "@material-ui/core";
import useRouter from "use-react-router";

const InputNameDialog = ({
  onClose,
  open,
  room
}: {
  onClose: () => void;
  open: boolean;
  room: string;
}) => {
  const router = useRouter();
  const [name, setName] = useState<string>(
    sessionStorage.getItem("name") || ""
  );

  const join = () => {
    router.history.push(`/rooms/${room}`);
    sessionStorage.setItem("name", name);
    onClose();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pick a name</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          value={name}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={join}
          disabled={name.length === 0}
          color="primary"
          variant="contained"
        >
          Join Server
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputNameDialog;
