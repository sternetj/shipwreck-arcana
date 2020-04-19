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
      <Doom />
      <Points />
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
  left: "calc(100% - 20px)",
  top: 0,
  backgroundColor: "#cd3133",
});

const Points = styled(Token)({
  left: "calc(100% - 20px)",
  top: "calc(50% - 20px)",
  backgroundColor: "#2d9966",
});
