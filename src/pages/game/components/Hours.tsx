import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { Card, CardProps } from "./Card";
import { Grid, styled } from "@material-ui/core";

const theHours = new CardClass("the-hours");

type Props = Omit<CardProps, "card"> & {
  doom: number;
  points: number;
};

export const Hours: FC<Props> = ({ doom, points, ...rest }) => {
  return (
    <Container>
      <Card {...rest} card={theHours} />
      <Doom style={scoreToPos[doom]} />
      <Points style={scoreToPos[points]} />
    </Container>
  );
};

const Container = styled(Grid)({
  position: "relative",
});

const Token = styled("div")({
  position: "absolute",
  width: 30,
  height: 30,
  clipPath: "circle(49% at center);",
});

const Doom = styled(Token)({
  backgroundColor: "#cd3133",
});

const Points = styled(Token)({
  backgroundColor: "#2d9966",
});

const scoreToPos: { [k: number]: React.CSSProperties } = {
  0: {
    left: "calc(100% - 20px)",
    top: 0,
  },
  1: {
    left: "calc(100% - 20px)",
    top: "calc(max(12.5vh, 85px) - 39px)",
  },
  2: {
    left: "calc(100% - 20px)",
    top: "calc(max(25vh, 170px) - 69px)",
  },
  3: {
    left: "calc(50% - 15px)",
    top: "calc(max(25vh, 170px) - 64px)",
  },
  4: {
    left: -10,
    top: "calc(max(25vh, 170px) - 69px)",
  },
  5: {
    left: -10,
    top: "calc(max(12.5vh, 85px) - 39px)",
  },
  6: {
    left: -10,
    top: 0,
  },
  7: {
    left: "calc(50% - 15px)",
    top: -10,
  },
};
