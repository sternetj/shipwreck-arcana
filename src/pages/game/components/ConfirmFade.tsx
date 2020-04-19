import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";

interface Props {
  open: boolean;
  onFade: Function;
  onCancel: Function;
}

export const ConfirmFade: FC<Props> = (props) => {
  const { open, onCancel, onFade } = props;
  return (
    <Dialog open={open}>
      <DialogContent>Fade this card?</DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={() => onCancel()}>
          No
        </Button>
        <Button variant="contained" color="primary" onClick={() => onFade()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
