import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { Card, CardProps } from "./Card";
import { Grid, styled } from "@material-ui/core";
import { FateVal } from "./Fate";
import { SteppedLineTo } from "./SteppedLineTo";

const theHours = new CardClass("the-hours");

type Props = Omit<CardProps, "card" | "index"> & {
  doom: number;
  points: number;
  playedOnHours?: FateVal;
  fateIndex?: number;
};

export const Hours: FC<Props> = (props) => {
  const { doom, points, playedOnHours, fateIndex = -1, ...rest } = props;
  const same = doom === points;
  return (
    <Container style={{ alignItems: "center" }}>
      <Card {...rest} index="hours" canFade={false} card={theHours} />
      <Doom
        style={{
          ...scoreToPos[doom],
          transform: same
            ? `translateY(${doom === 7 ? "-" : ""}35px)`
            : undefined,
        }}
      />
      <Points style={scoreToPos[points]} />
      {!!playedOnHours && fateIndex > -1 && (
        <SteppedLineTo
          from="hours"
          to={`active-${fateIndex}`}
          borderColor="rgba(172, 160, 45, 0.24)"
          borderWidth={2}
        />
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
    top: "calc(13.5rem / 2 + 24px - 15px)",
  },
  2: {
    left: "calc(100% - 20px)",
    top: "calc(13.5rem + 24px - 10px)",
  },
  3: {
    left: "calc(50% - 15px)",
    top: "calc(13.5rem + 24px + 5px)",
  },
  4: {
    left: -10,
    top: "calc(13.5rem + 24px - 10px)",
  },
  5: {
    left: -10,
    top: "calc(13.5rem / 2 + 24px - 15px)",
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
