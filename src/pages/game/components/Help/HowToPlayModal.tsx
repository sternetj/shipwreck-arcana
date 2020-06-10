import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  styled,
  Box,
  DialogTitle,
  Grid,
  ListSubheader,
  DialogProps,
  Link,
} from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import { ShareLink } from "../../../../components/ShareLink";
import { Fate } from "../Fate";
import { Token } from "../token";
import { Card } from "../../../../services/game";

interface Props extends DialogProps {
  gameId: string;
}

export const HowToPlayModal: FC<Props> = ({ gameId, ...dialogProps }) => {
  return (
    <Dialog {...dialogProps}>
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
            onto playable cards or the bag. Right-click or long press to reveal
            it to the other players.
          </ListItem>
          <ListItem>
            Click on a card to view it full screen or right-click (long press)
            it to perform an action <CardImg src={sampleCard.cardPath} />
          </ListItem>
          <List dense style={{ marginLeft: 16, marginTop: -16 }}>
            <ListItem>
              <ArrowRight /> Cards outlined in <Blue>blue</Blue> mean a fate can
              be played there
            </ListItem>
            <ListItem>
              <ArrowRight /> Cards outlined in <Yellow>yellow</Yellow> mean the
              card may fade this turn
            </ListItem>
            <ListItem>
              <ArrowRight /> Cards outlined in <Red>red</Red> mean the card will
              fade this turn
            </ListItem>
          </List>
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
          <ListItem>
            For game specific details please refer to the{" "}
            <Link
              style={{ marginLeft: 4 }}
              target="_blank"
              color="textSecondary"
              rel="noopener noreferrer"
              href="https://www.meromorphgames.com/shipwreck-arcana/rules">
              Rules
            </Link>
          </ListItem>
        </List>
        <ShareLink gameId={gameId} />
      </DialogContent>
    </Dialog>
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

const ColoredText = styled("span")({
  fontWeight: "bold",
  display: "inline-block",
  margin: "0 4px",
});
const Blue = styled(ColoredText)({ color: "lightskyblue" });
const Red = styled(ColoredText)({ color: "#cd3133" });
const Yellow = styled(ColoredText)({ color: "#ab9f00" });

const sampleCard = new Card("the-blind-man");
