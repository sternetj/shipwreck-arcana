import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { Card, CardProps } from "./Card";
import { Grid, styled } from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { FateVal, Fate } from "./Fate";

const theHours = new CardClass("the-hours");

type Props = Omit<CardProps, "card" | "index"> & {
  doom: number;
  points: number;
  playedOnHours?: FateVal;
};

export const Hours: FC<Props> = ({ doom, points, playedOnHours, ...rest }) => {
  const same = doom === points;
  return (
    <Container alignItems="center">
      <Card {...rest} index="hours" card={theHours} />
      <Doom
        style={{
          ...scoreToPos[doom],
          transform: same
            ? `translateY(${doom === 7 ? "-" : ""}35px)`
            : undefined,
        }}
      />
      <Points style={scoreToPos[points]} />
      {!!playedOnHours && (
        <Grid container justify="flex-end" alignItems="center">
          <Fate num={playedOnHours} styles={{ opacity: 0.6 }} />
          <DoubleArrowIcon style={{ opacity: 0.5, color: "#aca02d" }} />
        </Grid>
      )}
    </Container>
  );
};

const Container = styled(Grid)({
  position: "relative",
  marginBottom: 0,
});

const Token = styled("div")({
  position: "absolute",
  width: 27,
  height: 27,
  clipPath: "circle(49% at center);",
});

const Doom = styled(Token)({
  background: "url('pieces/doom.png') -2px -2px",
});

const Points = styled(Token)({
  background: "url('pieces/points.png') -2px -2px",
});

const scoreToPos: { [k: number]: React.CSSProperties } = {
  0: {
    left: "calc(100% - 20px)",
    top: 5,
  },
  1: {
    left: "calc(100% - 20px)",
    top: "calc(max(12.5vh, 85px) + 24px - 15px)",
  },
  2: {
    left: "calc(100% - 20px)",
    top: "calc(max(25vh, 170px) + 24px - 10px)",
  },
  3: {
    left: "calc(50% - 15px)",
    top: "calc(max(25vh, 170px) + 24px + 5px)",
  },
  4: {
    left: -10,
    top: "calc(max(25vh, 170px) + 24px - 10px)",
  },
  5: {
    left: -10,
    top: "calc(max(12.5vh, 85px) + 24px - 15px)",
  },
  6: {
    left: -10,
    top: 5,
  },
  7: {
    left: "calc(50% - 15px)",
    top: -10,
  },
};
