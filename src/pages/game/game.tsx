import React, { useState, useEffect } from "react";
import qs from "qs";
import { useLocation, useHistory } from "react-router-dom";
import { Card as CardClass } from "../../services/game";
import { Grid, CircularProgress } from "@material-ui/core";
import { Card } from "./components/Card";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Hours } from "./components/Hours";
import { Fate, FateVal } from "./components/Fate";
import { DndProvider } from "react-dnd";
import Html5Backend from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AdjustScore } from "./components/AdjustScore";
import { useGame, CardIndex, GameState } from "./hooks/use-game";
import { Bag } from "./components/Bag";
import { BaseCard } from "./components/BaseCard";
import { TokenRow } from "./components/TokenRow";
import { Help } from "./components/Help/Help";
import { NoGame } from "./components/NoGame";
import { SpectatorModal } from "./components/SpectatorModal";
import { TurnOrder } from "./components/TurnOrder";
import { opponentColors } from "../../services/firebase";
import { isMobile as checkIsMobile } from "is-mobile";
import { onLongPress } from "../../services/long-press";
import { ActivePowersRow } from "./components/ActivePowersRow";

const isMobile = checkIsMobile();
const Backend: any = isMobile ? TouchBackend : Html5Backend;

const Game = () => {
  const router = useHistory();
  const { search } = useLocation();
  const { name, player } = qs.parse(search, { ignoreQueryPrefix: true });
  const [cardToFade, setCardToFade] = useState<1 | 2 | 3 | 4>();
  const [powerToPlay, setPowerToPlay] = useState<CardClass>();
  const [fateToReveal, setFateToReveal] = useState<FateVal>();
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
  const { revealFate, newGame, removeActivePowers, undoAction } = game;

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
  const { playedOnHours, recentlyPlayed, activePowers } = value;
  const spectator = !players[playerId];
  const canJoin = Object.keys(players).length < 5;
  const { fates = [], tokens = [], color } = players[playerId] || {};
  const score = { points, doom };
  const sortedPlayers = sortPlayers(players, playerId);
  const otherTokens = sortedPlayers.map(({ value }) => value);

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

  if (process.env.NODE_ENV !== "production") {
    console.log(JSON.stringify(value, null, 2));
  }
  return (
    <>
      <DndProvider backend={Backend}>
        <Help
          gameId={name}
          canControl={!spectator}
          canUndo={!!value.snapshot}
          onNewGame={() => !spectator && newGame()}
          onUndo={() => !spectator && undoAction()}
        />
        <Grid container direction="column" alignItems="center">
          <Grid
            item
            container
            justify="center"
            style={{ padding: "2rem 48px" }}>
            {otherTokens.map(
              ({ tokens: ots, playerName, color, fates, revealed }) => (
                <TokenRow
                  key={color}
                  color={color}
                  tokens={fates}
                  revealedIndex={fates?.indexOf(revealed as any)}
                  selections={ots}
                  name={playerName}
                />
              ),
            )}
          </Grid>
          <Grid container item justify="center">
            {deck.length > 0 && (
              <BaseCard
                card={deck[0]}
                style={{
                  boxShadow: deck
                    .slice(1, 3)
                    .map(
                      (_, i) =>
                        `${2 * i + 1}px ${2 * i + 1}px 0 ${
                          2 + i
                        }px hsl(0, 0%, ${35 - 10 * i}%)`,
                    )
                    .join(", "),
                }}
              />
            )}
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
                recentlyPlayed={
                  i === recentlyPlayed?.source ? recentlyPlayed : undefined
                }
                acceptsDrop={!spectator ? ["fate", "power"] : []}
                onClick={confirmFade(i)}
                onDropFate={(val) => !spectator && playFate(i, val)}
                onDropPower={(val) => !spectator && attachPower(i, val)}
              />
            ))}
          </Grid>
          <ActivePowersRow
            powers={activePowers}
            canClear={!spectator}
            onClearPowers={() => !spectator && removeActivePowers()}
          />
          <Grid container justify="center">
            {powers.map((power) => (
              <BaseCard
                key={power.name}
                card={power}
                showPower
                {...onLongPress(() => !spectator && setPowerToPlay(power))}
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
              <Fate
                key={f}
                num={f}
                source={playerId}
                onClick={() => setFateToReveal(f)}
              />
            ))}
            {!spectator && (
              <Bag
                onClick={() => drawFate(playerId)}
                onDropFate={discardFate}
              />
            )}
          </Grid>
          <Grid
            container
            item
            justify="center"
            style={{ marginBottom: isMobile ? 65 : 0 }}>
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

      <TurnOrder />

      <ConfirmDialog
        prompt="Fade this card?"
        open={!!cardToFade}
        onConfirm={onFade}
        onCancel={closeConfirmFade}
      />

      <ConfirmDialog
        prompt="Play this Power?"
        open={!!powerToPlay}
        onConfirm={onPlayPower}
        onCancel={closeConfirmPlayPower}
      />

      <ConfirmDialog
        prompt="Reveal this fate?"
        open={!!fateToReveal}
        onConfirm={() => {
          revealFate(playerId, fateToReveal!);
          setFateToReveal(undefined);
        }}
        onCancel={() => setFateToReveal(undefined)}
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

const sortPlayers = (players: GameState["players"], playerId = "") => {
  const sorted = Object.entries(players)
    .sort(
      ([, { color: colorA }], [, { color: colorB }]) =>
        opponentColors.indexOf(colorA) - opponentColors.indexOf(colorB),
    )
    .map(([key, value]) => ({ key, value }));
  const indexOfPlayer = sorted.findIndex(({ key }) => key === playerId);

  if (indexOfPlayer === -1) return sorted;

  return sorted.slice(indexOfPlayer + 1).concat(sorted.slice(0, indexOfPlayer));
};

const cardsIndices: CardIndex[] = [1, 2, 3, 4];

export default Game;
