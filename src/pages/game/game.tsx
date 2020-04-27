import React, { useState } from "react";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { Card as CardClass } from "../../services/game";
import { Grid } from "@material-ui/core";
import { Card } from "./components/Card";
import { ConfirmFade } from "./components/ConfirmFade";
import { Hours } from "./components/Hours";
import { Fate } from "./components/Fate";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { AdjustScore } from "./components/AdjustScore";
import { useGame } from "./hooks/use-game";

const Game = () => {
  const { search } = useLocation();
  const { name } = qs.parse(search, { ignoreQueryPrefix: true });
  const [confirmFadeOpen, setConfirmFade] = useState(false);
  const [adjustPointsOpen, setAdjustPointsOpen] = useState(false);
  const { value, updateScore } = useGame(name);

  const { points, doom, deck, cards } = value;
  const score = { points, doom };

  const confirmFade = (slot: number) => (card: CardClass) => {
    console.log("fade", card);
    setConfirmFade(true);
  };

  const beginAdjustScore = () => {
    setAdjustPointsOpen(true);
  };

  const adjustScore = (points: number, doom: number) => {
    updateScore({ points, doom });
    setAdjustPointsOpen(false);
  };

  const closeConfirm = () => setConfirmFade(false);

  console.log(JSON.stringify(value, null, 2));
  return (
    <>
      <DndProvider backend={Backend}>
        <Grid container direction="column" alignItems="center">
          <Grid item>Player tiles</Grid>
          <Grid container item direction="row" wrap="nowrap">
            <Card card={deck[0]} />
            <Hours {...score} allowsDrop onClick={beginAdjustScore} />
            <Card card={cards[1]} allowsDrop onClick={confirmFade(1)} />
            <Card card={cards[2]} allowsDrop onClick={confirmFade(2)} />
            <Card card={cards[3]} allowsDrop onClick={confirmFade(3)} />
            <Card card={cards[4]} allowsDrop onClick={confirmFade(4)} />
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

      <AdjustScore
        open={adjustPointsOpen}
        {...score}
        onCancel={() => setAdjustPointsOpen(false)}
        onUpdate={adjustScore}
      />
    </>
  );
};

const fates = new Array(7).fill(1).map((_, i) => i + 1);

interface GameState {
  points: 0;
  doom: 0;
}

export default Game;
