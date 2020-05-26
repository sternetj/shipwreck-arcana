import React, { useState, useEffect } from "react";
import qs from "qs";
import { useLocation, useHistory } from "react-router-dom";
import { Card as CardClass } from "../../services/game";
import { Grid, CircularProgress } from "@material-ui/core";
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
import { TokenRow } from "./components/TokenRow";
import { Help } from "./components/Help/Help";
import { NoGame } from "./components/NoGame";
import { SpectatorModal } from "./components/SpectatorModal";

const Game = () => {
  const router = useHistory();
  const { search } = useLocation();
  const { name, player } = qs.parse(search, { ignoreQueryPrefix: true });
  const [cardToFade, setCardToFade] = useState<1 | 2 | 3 | 4>();
  const [powerToPlay, setPowerToPlay] = useState<CardClass>();
  const [adjustPointsOpen, setAdjustPointsOpen] = useState(false);
  const [spectatorModalShown, setSpectatorModalShown] = useState<boolean>(
    false,
  );
  const [playerId] = useState(
    player || window.localStorage.getItem("playerId") || "",
  );
  const game = useGame(name);
  const { value, updateScore, fadeCard, drawFate, playFate, playPower } = game;
  const { loading, discardFate, flipToken, attachPower, leaveGame } = game;
  const { newGame } = game;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      window.onbeforeunload = () => leaveGame(playerId);
    }
  }, [leaveGame, playerId]);

  useEffect(() => {
    return () => leaveGame(playerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading && !value) {
    return (
      <NoGame
        gameId={name}
        onContinue={() => {
          router.push("/");
        }}
      />
    );
  }

  if (!value)
    return (
      <Grid container justify="center" style={{ marginTop: "4rem" }}>
        <CircularProgress color="secondary" size={65} />
      </Grid>
    );

  const { points, doom, deck, cards, powers, players } = value;
  const { playedOnHours } = value;
  const spectator = !players[playerId];
  const canJoin = Object.keys(players).length < 5;
  const { fates = [], tokens = [], color } = players[playerId] || {};
  const score = { points, doom };
  const otherTokens = Object.entries(players)
    .filter(([k]) => k !== playerId)
    .map(([_, v]) => v);

  const confirmFade = (slot: 1 | 2 | 3 | 4) => (card: CardClass) => {
    if (spectator) return;

    setCardToFade(slot);
  };

  const beginAdjustScore = () => {
    if (spectator) return;

    setAdjustPointsOpen(true);
  };

  const adjustScore = (points: number, doom: number) => {
    if (spectator) return;

    updateScore({ points, doom });
    setAdjustPointsOpen(false);
  };

  const closeConfirmFade = () => {
    if (spectator) return;

    setCardToFade(undefined);
  };
  const closeConfirmPlayPower = () => {
    if (spectator) return;

    setPowerToPlay(undefined);
  };

  const onFade = () => {
    if (spectator) return;

    cardToFade && fadeCard(cardToFade);
    closeConfirmFade();
  };

  const onPlayPower = () => {
    if (spectator) return;

    powerToPlay && playPower(powerToPlay);
    closeConfirmPlayPower();
  };

  console.log(JSON.stringify(value, null, 2));
  return (
    <>
      <DndProvider backend={Backend}>
        <Help
          gameId={name}
          canRestart={!spectator}
          onNewGame={() => !spectator && newGame()}
        />
        <Grid container direction="column" alignItems="center">
          <Grid
            item
            container
            justify="center"
            style={{ padding: "2rem 48px" }}>
            {otherTokens.map(({ tokens: ots, playerName, color }) => (
              <TokenRow color={color} selections={ots} name={playerName} />
            ))}
          </Grid>
          <Grid container item justify="center">
            {deck.length > 0 && <BaseCard card={deck[0]} />}
            <Hours
              {...score}
              acceptsDrop={!spectator ? ["fate"] : []}
              playedOnHours={playedOnHours}
              onDropFate={(val) => !spectator && playFate("hours", val)}
              onClick={beginAdjustScore}
            />
            {cardsIndices.map((i) => (
              <Card
                key={i}
                index={i}
                card={cards[i]}
                acceptsDrop={!spectator ? ["fate", "power"] : []}
                onClick={confirmFade(i)}
                onDropFate={(val) => !spectator && playFate(i, val)}
                onDropPower={(val) => !spectator && attachPower(i, val)}
              />
            ))}
          </Grid>
          <Grid container justify="center">
            {(powers || []).map((power) => (
              <BaseCard
                card={power}
                showPower
                onContextMenu={(e) => {
                  if (spectator) return;

                  setPowerToPlay(power);
                  e.preventDefault();
                }}
              />
            ))}
          </Grid>
          <Grid
            container
            item
            justify="center"
            alignItems="center"
            style={{ padding: "2rem 0" }}>
            {fates.map((f) => (
              <Fate key={f} num={f as any} source={playerId} />
            ))}
            {!spectator && (
              <Bag
                onClick={() => drawFate(playerId)}
                onDropFate={discardFate}
              />
            )}
          </Grid>
          <Grid container item justify="center">
            <TokenRow
              selections={tokens}
              color={color}
              fullWidth
              onClick={(f: FateVal) =>
                !spectator && flipToken(playerId, f, !tokens[f])
              }
            />
          </Grid>
        </Grid>
      </DndProvider>

      <ConfirmFade
        prompt="Fade this card?"
        open={!!cardToFade}
        onConfirm={onFade}
        onCancel={closeConfirmFade}
      />

      <ConfirmFade
        prompt="Play this Power?"
        open={!!powerToPlay}
        onConfirm={onPlayPower}
        onCancel={closeConfirmPlayPower}
      />

      <AdjustScore
        open={adjustPointsOpen}
        {...score}
        onCancel={() => !spectator && setAdjustPointsOpen(false)}
        onUpdate={adjustScore}
      />

      <SpectatorModal
        open={spectator && !spectatorModalShown}
        canJoin={canJoin}
        onSpectate={() => {
          setSpectatorModalShown(true);
        }}
        onJoinOrLeave={() => {
          router.push(canJoin ? `/join${search}` : `/`);
          setSpectatorModalShown(true);
        }}
      />
    </>
  );
};

const cardsIndices: CardIndex[] = [1, 2, 3, 4];

export default Game;
