import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
} from "@material-ui/core";

interface Props {
  open: boolean;
  canJoin: boolean;
  onSpectate: Function;
  onJoinOrLeave: Function;
}

export const SpectatorModal: FC<Props> = (props) => {
  const { open, canJoin, onJoinOrLeave, onSpectate } = props;
  return (
    <Dialog open={open}>
      <DialogTitle>
        Game is currently in progress{canJoin ? "" : " and is full"}
      </DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        {canJoin
          ? "You can either join this game or continue as a spectator"
          : "You can either spectate this game or leave and play a different one"}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={() => onSpectate()}>
          Spectate
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onJoinOrLeave()}>
          {canJoin ? "Join Game" : "Leave Game"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
