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
} from "@material-ui/core";

import HelpRounded from "@material-ui/icons/HelpRounded";
import { ShareLink } from "../../../components/ShareLink";
import { Fate } from "./Fate";
import { Token } from "./token";
import { Card } from "../../../services/game";

interface Props {
  gameId: string;
}

export const Help: FC<Props> = ({ gameId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        name="help"
        color="inherit"
        onClick={() => setOpen(true)}
        style={{ position: "absolute", right: 0, top: 0 }}>
        <HelpRounded />
      </IconButton>
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
          </List>
          <ShareLink gameId={gameId} />
        </DialogContent>
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
