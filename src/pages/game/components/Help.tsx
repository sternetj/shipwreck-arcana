import React, { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  styled,
  Box,
  DialogTitle,
  Grid,
  DialogActions,
  Button,
  ListSubheader,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import HelpRounded from "@material-ui/icons/HelpRounded";
import ExitToApp from "@material-ui/icons/ExitToAppOutlined";
import { ShareLink } from "../../../components/ShareLink";
import { Fate } from "./Fate";
import { Token } from "./token";
import { Card } from "../../../services/game";

interface Props {
  gameId: string;
}

export const Help: FC<Props> = ({ gameId }) => {
  const router = useHistory();
  const [open, setOpen] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);

  return (
    <>
      <Grid
        direction="column"
        style={{ position: "absolute", right: 0, top: 0, display: "flex" }}>
        <IconButton color="inherit" onClick={() => setOpen(true)} title="Help">
          <HelpRounded />
        </IconButton>
        <IconButton
          title="Leave Game"
          color="inherit"
          onClick={() => setConfirmExitOpen(true)}>
          <ExitToApp />
        </IconButton>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{ textAlign: "center" }}>How to Play</DialogTitle>
        <DialogContent style={{ padding: "0px 24px 24px 24px" }}>
          <List>
            <ListItem>
              You can click the bag to draw a fate <Bag />
            </ListItem>
            <ListItem style={{ display: "inline-block" }}>
              Drag and drop fates{" "}
              <Inline>
                <Fate num={3} />
              </Inline>{" "}
              onto playable cards or the bag when applicable
            </ListItem>
            <ListItem>
              Click on a card to view it full screen or right-click it to
              perform an action <CardImg src={sampleCard.cardPath} />
            </ListItem>
            <ListItem style={{ display: "inline-block" }}>
              Click a token{" "}
              <Inline>
                <Token num={4} color="blue" />
              </Inline>{" "}
              to flip it over
            </ListItem>
            <ListSubheader disableSticky>Difficulty</ListSubheader>
            <ListItem dense>
              <Grid container direction="row" justify="space-around">
                <span>
                  <b>Zero</b>: Easy
                </span>
                <span>
                  <b>2</b>: Normal
                </span>
                <span>
                  <b>4</b>: Hard
                </span>
                <span>
                  <b>6</b>: Doomed!
                </span>
              </Grid>
            </ListItem>
          </List>
          <ShareLink gameId={gameId} />
        </DialogContent>
      </Dialog>
      <Dialog open={confirmExitOpen}>
        <DialogTitle>Exit Game?</DialogTitle>
        <DialogContent style={{ padding: "0px 24px 24px 24px" }}>
          Are you sure you want to leave the game?
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setConfirmExitOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/")}>
            Exit Game
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Bag = () => (
  <img src={`pieces/bag.png`} style={{ height: 50 }} alt="draw-bag" />
);

const CardImg = styled("img")({
  boxSizing: "border-box",
  height: "70px",
  marginLeft: 8,
});

const Inline = styled(Box)({
  display: "inline-block",
  verticalAlign: "middle",
  "&& *": {
    cursor: "default",
  },
});

const sampleCard = new Card("the-blind-man");
