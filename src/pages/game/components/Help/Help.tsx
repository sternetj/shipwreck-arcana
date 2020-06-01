import React, { FC, useState, useMemo } from "react";
import { IconButton, Grid } from "@material-ui/core";

import HelpRounded from "@material-ui/icons/HelpRounded";
import ExitToApp from "@material-ui/icons/ExitToAppOutlined";
import Refresh from "@material-ui/icons/Refresh";
import Undo from "@material-ui/icons/Undo";
import { HowToPlayModal } from "./HowToPlayModal";
import { ExitGameModal } from "./ExitGameModal";
import { NewGameModal } from "./NewGameModal";
import { ConfirmDialog } from "../ConfirmDialog";

interface Props {
  gameId: string;
  canControl: boolean;
  canUndo: boolean;
  onNewGame: Function;
  onUndo: Function;
}

export const Help: FC<Props> = ({
  gameId,
  canControl,
  canUndo,
  onNewGame,
  onUndo,
}) => {
  const [open, setOpen] = useState<"howTo" | "exit" | "newGame" | "undo">();

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
        {canControl && canUndo && (
          <IconButton
            title="Undo"
            color="inherit"
            onClick={() => setOpen("undo")}>
            <Undo />
          </IconButton>
        )}
        {canControl && (
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
        open={open === "newGame" && canControl}
        onNewGame={() => {
          onNewGame();
          close();
        }}
        onCancel={close}
      />

      <ExitGameModal open={open === "exit"} onCancel={close} />

      <ConfirmDialog
        prompt="Are you sure you want to undo the previous action?"
        open={open === "undo" && canControl}
        onCancel={close}
        onConfirm={() => {
          onUndo();
          close();
        }}
      />
    </>
  );
};
