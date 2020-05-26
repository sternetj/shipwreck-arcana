import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogProps,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";

interface Props extends DialogProps {
  onCancel: Function;
  onNewGame: Function;
}

export const NewGameModal: FC<Props> = (props) => {
  const { onCancel, onNewGame, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Start a New Game?</DialogTitle>
      <DialogContent style={{ padding: "0px 24px 24px 24px" }}>
        <Typography variant="body1">
          Are you sure you want to start a new game?
        </Typography>
        <Typography variant="caption">
          <b>Warning</b>: It is best to tell the other players before doing this
          or they may get upset
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onNewGame()}>
          New Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};
