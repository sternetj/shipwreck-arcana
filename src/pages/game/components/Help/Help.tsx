import React, { FC, useState, useMemo } from "react";
import { IconButton, Grid } from "@material-ui/core";

import HelpRounded from "@material-ui/icons/HelpRounded";
import ExitToApp from "@material-ui/icons/ExitToAppOutlined";
import Sync from "@material-ui/icons/Sync";
import Undo from "@material-ui/icons/Undo";
import { HowToPlayModal } from "./HowToPlayModal";
import { ExitGameModal } from "./ExitGameModal";
import { NewGameModal } from "./NewGameModal";
import { ConfirmDialog } from "../ConfirmDialog";
import { isMobile as checkIsMobile } from "is-mobile";

const isMobile = checkIsMobile();

interface Props {
  gameId: string;
  canControl: boolean;
  canUndo: boolean;
  onNewGame: Function;
  onUndo: Function;
  onExitGame: Function;
}

export const Help: FC<Props> = (props) => {
  const { gameId, canControl, canUndo, onNewGame, onUndo, onExitGame } = props;
  const [open, setOpen] = useState<"howTo" | "exit" | "newGame" | "undo">();

  const close = useMemo(() => () => setOpen(undefined), [setOpen]);

  return (
    <>
      <Grid
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
        }}>
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
            <Sync />
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

      <ExitGameModal
        open={open === "exit"}
        onCancel={close}
        onExitGame={onExitGame}
      />

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
