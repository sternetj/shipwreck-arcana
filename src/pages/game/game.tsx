import React, { useState } from "react";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { Card as CardClass } from "../../services/game";
import { Grid, CircularProgress } from "@material-ui/core";
import { Card } from "./components/Card";
import { ConfirmFade } from "./components/ConfirmFade";
import { Hours } from "./components/Hours";
import { Fate } from "./components/Fate";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { AdjustScore } from "./components/AdjustScore";
import { useGame, CardIndex } from "./hooks/use-game";
import { Bag } from "./components/Bag";
import { BaseCard } from "./components/BaseCard";

const Game = () => {
  const { search } = useLocation();
  const { name } = qs.parse(search, { ignoreQueryPrefix: true });
  const [cardToFade, setCardToFade] = useState<1 | 2 | 3 | 4>();
  const [adjustPointsOpen, setAdjustPointsOpen] = useState(false);
  const [playerId] = useState(window.localStorage.getItem("playerId") || "");
  const { value, updateScore, fadeCard, drawFate, playFate } = useGame(name);

  if (!value) return <CircularProgress />;

  const { points, doom, deck, cards, powers, players } = value;
  const { fates = [] } = players[playerId];
  const score = { points, doom };

  const confirmFade = (slot: 1 | 2 | 3 | 4) => (card: CardClass) => {
    setCardToFade(slot);
  };

  const beginAdjustScore = () => {
    setAdjustPointsOpen(true);
  };

  const adjustScore = (points: number, doom: number) => {
    updateScore({ points, doom });
    setAdjustPointsOpen(false);
  };

  const closeConfirm = () => setCardToFade(undefined);

  const onFade = () => {
    cardToFade && fadeCard(cardToFade);
    closeConfirm();
  };

  console.log(JSON.stringify(value, null, 2));
  return (
    <>
      <DndProvider backend={Backend}>
        <Grid container direction="column" alignItems="center">
          <Grid item>Player tiles</Grid>
          <Grid container item justify="center">
            <BaseCard card={deck[0]} />
            <Hours {...score} allowsDrop onClick={beginAdjustScore} />
            {cardsIndices.map((i) => (
              <Card
                key={i}
                index={i}
                card={cards[i]}
                allowsDrop
                onClick={confirmFade(i)}
                onDropFate={(val) => playFate(i, val)}
              />
            ))}
          </Grid>
          <Grid container justify="center">
            {(powers || []).map((power) => (
              <BaseCard card={power} showPower />
            ))}
          </Grid>
          <Grid container item justify="center" alignItems="center">
            {fates.map((f) => (
              <Fate key={f} num={f as any} source={playerId} />
            ))}
            <Bag onClick={() => drawFate(playerId)} />
          </Grid>
          <Grid item>Your tiles</Grid>
        </Grid>
      </DndProvider>

      <ConfirmFade
        open={!!cardToFade}
        onFade={onFade}
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

const cardsIndices: CardIndex[] = [1, 2, 3, 4];

export default Game;
