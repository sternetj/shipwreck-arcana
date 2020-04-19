import React, { useState } from "react";
import qs from "qs";
import { useObjectVal } from "react-firebase-hooks/database";
import { useLocation } from "react-router-dom";
import { getGame } from "../../services/firebase";
import { cards, Card as CardClass } from "../../services/game";
import { Grid } from "@material-ui/core";
import { Card } from "./components/Card";
import { ConfirmFade } from "./components/ConfirmFade";
import { Hours } from "./components/Hours";
import { Fate } from "./components/Fate";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

const Game = () => {
  const { search } = useLocation();
  const { name } = qs.parse(search, { ignoreQueryPrefix: true });
  const [snapshot] = useObjectVal(getGame(name || ""));
  const [confirmFadeOpen, setConfirmFade] = useState(false);

  const confirmFade = (slot: number) => (card: CardClass) => {
    console.log("fade", card);
    setConfirmFade(true);
  };

  const closeConfirm = () => setConfirmFade(false);

  console.log(JSON.stringify(snapshot, null, 2));
  return (
    <>
      <DndProvider backend={Backend}>
        <Grid container direction="column" alignItems="center">
          <Grid item>Player tiles</Grid>
          <Grid container item direction="row" wrap="nowrap">
            <Card card={cards[1]} />
            <Hours doom={0} points={2} allowsDrop />
            <Card card={cards[2]} allowsDrop onClick={confirmFade(1)} />
            <Card card={cards[3]} allowsDrop onClick={confirmFade(2)} />
            <Card card={cards[4]} allowsDrop onClick={confirmFade(3)} />
            <Card card={cards[5]} allowsDrop onClick={confirmFade(4)} />
          </Grid>
          <Grid container item justify="center">
            {fates.map((f) => (
              <Fate key={f} num={f as any} />
            ))}
          </Grid>
          <Grid item>Your tiles</Grid>
        </Grid>
      </DndProvider>

      <ConfirmFade
        open={confirmFadeOpen}
        onFade={closeConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
};

const fates = new Array(7).fill(1).map((_, i) => i + 1);

export default Game;
