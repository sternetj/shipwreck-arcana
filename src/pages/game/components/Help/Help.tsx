import React, { FC, useState, useMemo } from "react";
import { IconButton, Grid } from "@material-ui/core";

import HelpRounded from "@material-ui/icons/HelpRounded";
import ExitToApp from "@material-ui/icons/ExitToAppOutlined";
import Refresh from "@material-ui/icons/Refresh";
import { HowToPlayModal } from "./HowToPlayModal";
import { ExitGameModal } from "./ExitGameModal";
import { NewGameModal } from "./NewGameModal";

interface Props {
  gameId: string;
  canRestart: boolean;
  onNewGame: Function;
}

export const Help: FC<Props> = ({ gameId, canRestart, onNewGame }) => {
  const [open, setOpen] = useState<"howTo" | "exit" | "newGame">();

  const close = useMemo(() => () => setOpen(undefined), [setOpen]);

  return (
    <>
      <Grid
        direction="column"
        style={{ position: "absolute", right: 0, top: 0, display: "flex" }}>
        <IconButton
          title="Help"
          color="inherit"
          onClick={() => setOpen("howTo")}>
          <HelpRounded />
        </IconButton>
        {canRestart && (
          <IconButton
            title="New Game"
            color="inherit"
            onClick={() => setOpen("newGame")}>
            <Refresh />
          </IconButton>
        )}
        <IconButton
          title="Leave Game"
          color="inherit"
          onClick={() => setOpen("exit")}>
          <ExitToApp />
        </IconButton>
      </Grid>

      <HowToPlayModal gameId={gameId} open={open === "howTo"} onClose={close} />

      <NewGameModal
        open={open === "newGame" && canRestart}
        onNewGame={() => {
          onNewGame();
          close();
        }}
        onCancel={close}
      />

      <ExitGameModal open={open === "exit"} onCancel={close} />
    </>
  );
};
