import React, { useState } from "react";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { Card as CardClass } from "../../services/game";
import { Grid, CircularProgress, Typography } from "@material-ui/core";
import { Card } from "./components/Card";
import { ConfirmFade } from "./components/ConfirmFade";
import { Hours } from "./components/Hours";
import { Fate, FateVal } from "./components/Fate";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { AdjustScore } from "./components/AdjustScore";
import { useGame, CardIndex } from "./hooks/use-game";
import { Bag } from "./components/Bag";
import { BaseCard } from "./components/BaseCard";
import { Token } from "./components/token";

const Game = () => {
  const { search } = useLocation();
  const { name, player } = qs.parse(search, { ignoreQueryPrefix: true });
  const [cardToFade, setCardToFade] = useState<1 | 2 | 3 | 4>();
  const [adjustPointsOpen, setAdjustPointsOpen] = useState(false);
  const [playerId] = useState(
    player || window.localStorage.getItem("playerId") || "",
  );
  const game = useGame(name);
  const { value, updateScore, fadeCard, drawFate, playFate } = game;
  const { discardFate, flipToken } = game;

  if (!value) return <CircularProgress />;
  console.log(value);

  const { points, doom, deck, cards, powers, players } = value;
  console.log(player);
  console.log(playerId);
  console.log(players);
  const { fates = [], tokens = [], playerName, color } =
    players[playerId] || {};
  const score = { points, doom };
  const otherTokens = Object.entries(players)
    .filter(([k]) => k !== playerId)
    .map(([_, v]) => v);

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
          <Grid item container justify="center">
            {otherTokens.map(({ tokens: ots, playerName, color }) => (
              <Grid item container justify="center" xs={12} md={4} sm={6}>
                {tokenVals.map((f) => (
                  <Token
                    key={f}
                    num={f as any}
                    color={color}
                    flipped={ots[f]}
                  />
                ))}
                <Typography>{playerName}</Typography>
              </Grid>
            ))}
          </Grid>
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
            <Bag onClick={() => drawFate(playerId)} onDropFate={discardFate} />
          </Grid>
          <Grid container item justify="center" alignItems="center">
            {tokenVals.map((f) => (
              <Token
                key={f}
                num={f as any}
                color={color}
                flipped={tokens[f]}
                onClick={() => flipToken(playerId, f, !tokens[f])}
              />
            ))}
            <Typography>{playerName}</Typography>
          </Grid>
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
const tokenVals: FateVal[] = [1, 2, 3, 4, 5, 6, 7];

export default Game;
