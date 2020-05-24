import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  styled,
} from "@material-ui/core";

interface Props {
  gameId: string;
  onContinue: Function;
}

export const NoGame: FC<Props> = (props) => {
  const { gameId, onContinue } = props;
  return (
    <Dialog open>
      <DialogContent style={{ padding: 24, textAlign: "center" }}>
        Could not find a game called <Highlight>{gameId}</Highlight>.<br />
        Please join or create a different game instead.
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onContinue()}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Highlight = styled("span")({
  color: "#2d9966",
  fontSize: "1.25rem",
});
