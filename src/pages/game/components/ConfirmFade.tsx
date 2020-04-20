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
      <DialogContent style={{ padding: 24, textAlign: "center" }}>
        Fade this card?
      </DialogContent>
      <DialogActions style={{ paddingLeft: 24, paddingRight: 24 }}>
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
