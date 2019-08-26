import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input
} from "@material-ui/core";
import useApi, { getCategories } from "../hooks/useApi";
import usePersistedState from "hooks/usePersistedState";

interface Props {
  onClose: () => void;
  open: boolean;
}

const CreateRoomDialog = (props: Props) => {
  const api = useApi();
  const [roomName, setRoomName] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [categories, setCategories] = usePersistedState<string[]>(
    [],
    "categories"
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handle = (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setter(e.target.value);

  const handleSwitch = (setter: any) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setter(e.target.checked);

  const createRoom = () => {
    api.createRoom({
      name: roomName,
      public: isPublic,
      categories: selectedCategories
    });
    props.onClose();
  };

  return (
    <Dialog
      style={{ minWidth: 300, width: "95%" }}
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>Create a Room</DialogTitle>
      <DialogContent>
        <TextField
          value={roomName}
          onChange={handle(setRoomName)}
          variant="outlined"
          label="Room Name"
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={isPublic} onChange={handleSwitch(setPublic)} />
            }
            label="Public"
          />
        </FormGroup>
        <FormControl style={{ width: "100%" }}>
          <InputLabel htmlFor="select-categories">Categories</InputLabel>
          <Select
            title="Categories"
            fullWidth
            multiple
            multiline
            value={selectedCategories}
            onChange={e => setSelectedCategories(e.target.value as string[])}
            input={<Input id="select-categories" />}
          >
            {categories.map(c => (
              <MenuItem
                style={{
                  textTransform: "capitalize",
                  fontWeight: selectedCategories.indexOf(c) > -1 ? 500 : 400
                }}
                key={c}
                value={c}
              >
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={createRoom}
          disabled={roomName.length === 0 || selectedCategories.length === 0}
          color="primary"
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomDialog;
