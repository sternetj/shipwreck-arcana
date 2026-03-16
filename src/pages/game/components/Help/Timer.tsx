import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  LinearProgress,
  useTheme,
} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircleOutline";
import RemoveCircle from "@material-ui/icons/RemoveCircleOutline";
import { useGame } from "../../hooks/use-game";
import { useInterval } from "usehooks-ts";

export const Timer = ({ gameId }: { gameId: string }) => {
  const { value, updateTimer } = useGame(gameId);
  const { duration = 60, endTime } = value?.timer ?? {};
  const [_, setState] = useState(1);
  const theme = useTheme();

  let isTiming = false;
  let isOver = false;
  let seconds = duration % 60;
  let minutes = (duration - seconds) / 60;
  let dur = duration;

  if (endTime) {
    isTiming = true;
    const et = new Date(endTime);
    const now = new Date();
    isOver = et < now;
    dur = isOver
      ? 0
      : Math.round(Math.abs(et.getTime() - now.getTime()) / 1000);
    seconds = dur % 60;
    minutes = (dur - seconds) / 60;
  }

  useInterval(
    () => {
      setState((v) => v + 1);
    },
    endTime && !isOver ? 1000 : null
  );

  return (
    <Card
      style={{
        padding: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 220,
        height: 100,
        backgroundColor: "white",
        borderRadius: 8,
      }}
    >
      <Box display="flex" alignItems="center">
        <IconButton
          color="secondary"
          onClick={() => updateTimer({ duration: duration + 60 })}
          disabled={isTiming}
          title="+1 min"
        >
          <AddCircle />
        </IconButton>
        <Typography
          style={{
            textAlign: "center",
            transition: "color 0.2s",
            color: isOver ? theme.palette.error.dark : "initial",
          }}
          variant="h4"
        >
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </Typography>
        <IconButton
          color="secondary"
          onClick={() => updateTimer({ duration: Math.max(0, duration - 30) })}
          disabled={isTiming || duration <= 0}
          title="-30 sec"
        >
          <RemoveCircle />
        </IconButton>
      </Box>
      {(isTiming || isOver) && (
        <LinearProgress
          variant="determinate"
          value={(100 * (duration - dur)) / duration}
          style={{
            width: "100%",
            marginBottom: 8,
          }}
        />
      )}
      <Box>
        <Button
          style={{ marginRight: 8 }}
          variant="outlined"
          color="secondary"
          onClick={() =>
            updateTimer({
              endTime: "",
            })
          }
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isTiming || duration <= 0}
          onClick={() =>
            updateTimer({
              endTime: new Date(
                new Date().getTime() + duration * 1000
              ).toISOString(),
            })
          }
        >
          Start
        </Button>
      </Box>
    </Card>
  );
};
