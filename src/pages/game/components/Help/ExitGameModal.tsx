import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogProps,
  DialogActions,
  Button,
} from "@material-ui/core";

interface Props extends DialogProps {
  onCancel: Function;
  onExitGame: Function;
}

export const ExitGameModal: FC<Props> = (props) => {
  const { onCancel, onExitGame, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Exit Game?</DialogTitle>
      <DialogContent style={{ padding: "0px 24px 24px 24px" }}>
        Are you sure you want to leave the game?
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onExitGame()}>
          Exit Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};
