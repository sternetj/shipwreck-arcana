import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircleOutline";
import RemoveCircle from "@material-ui/icons/RemoveCircleOutline";
import { useGame } from "../../hooks/use-game";
import { useInterval } from "usehooks-ts";

export const Timer = ({ gameId }: { gameId: string }) => {
  const { value, updateTimer } = useGame(gameId);
  const { duration = 60, endTime } = value?.timer ?? {};
  const [_, setTick] = useState(0);

  const isTiming = !!endTime;
  const remaining = isTiming
    ? Math.round((new Date(endTime).getTime() - Date.now()) / 1000)
    : duration;
  const isOver = isTiming && remaining <= 0;
  const display = isTiming ? Math.abs(remaining) : duration;
  const minutes = Math.floor(display / 60);
  const seconds = display % 60;

  useInterval(
    () => {
      setTick((v) => v + 1);
    },
    endTime ? 1000 : null
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
            color: isOver ? "#c62828" : "initial",
          }}
          variant="h4"
        >
          {isOver ? "-" : ""}
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
          value={Math.min(100, (100 * (duration - Math.max(0, remaining))) / duration)}
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
