import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";

interface Props {
  open: boolean;
  onConfirm: Function;
  onCancel: Function;
  prompt: string;
}

export const ConfirmFade: FC<Props> = (props) => {
  const { prompt, open, onCancel, onConfirm } = props;
  return (
    <Dialog open={open}>
      <DialogContent style={{ padding: 24, textAlign: "center" }}>
        {prompt}
      </DialogContent>
      <DialogActions style={{ paddingLeft: 24, paddingRight: 24 }}>
        <Button variant="outlined" color="secondary" onClick={() => onCancel()}>
          No
        </Button>
        <Button variant="contained" color="primary" onClick={() => onConfirm()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
