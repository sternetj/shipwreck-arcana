import React, { FC, useState, useEffect } from "react";
import { Card as CardClass } from "../../../services/game";
import { Card, CardProps } from "./Card";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  styled,
  Typography,
} from "@material-ui/core";
import { FateVal } from "./Fate";
import { SteppedLineTo } from "./SteppedLineTo";

const theHours = new CardClass("the-hours");

type Props = Omit<CardProps, "card" | "index"> & {
  doom: number;
  points: number;
  playedOnHours?: FateVal;
  fateIndex?: number;
  activePlayerName?: string;
};

export const Hours: FC<Props> = (props) => {
  const {
    doom,
    points,
    playedOnHours,
    fateIndex = -1,
    activePlayerName,
    ...rest
  } = props;
  const same = doom === points;
  const showLine = !!playedOnHours && fateIndex > -1;
  const [hoursModalOpen, setHoursModalOpen] = useState(false);

  useEffect(() => {
    if (showLine) {
      setHoursModalOpen(true);
    }
  }, [playedOnHours, fateIndex, showLine]);

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
      {showLine && (
        <SteppedLineTo
          from="hours"
          to={`active-${fateIndex}`}
          borderColor="rgba(172, 160, 45, 0.24)"
          borderWidth={2}
        />
      )}
      <Dialog open={hoursModalOpen}>
        <DialogTitle>Played On Hours!</DialogTitle>
        <DialogContent style={{ padding: "0px 24px 24px 24px" }}>
          <Typography variant="body1">
            {activePlayerName} played on The Hours.
            <br />
            This means they are unable to play on any of the other 4 cards in
            play
          </Typography>
          {/* TODO Show dynamic content here */}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => setHoursModalOpen(false)}>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
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
