import React, { useState, useEffect } from "react";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";
import { Card as CardClass } from "../../services/game";
import { Grid, CircularProgress, Button, Slide } from "@material-ui/core";
import { Card } from "./components/Card";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Hours } from "./components/Hours";
import { Fate, FateVal } from "./components/Fate";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AdjustScore } from "./components/AdjustScore";
import { useGame, CardIndex, GameState } from "./hooks/use-game";
import { Bag } from "./components/Bag";
import { BaseCard } from "./components/BaseCard";
import { TokenRow } from "./components/TokenRow";
import { Help } from "./components/Help/Help";
import { NoGame } from "./components/NoGame";
import { SpectatorModal } from "./components/SpectatorModal";
import { opponentColors } from "../../services/firebase";
import { isMobile as checkIsMobile } from "is-mobile";
import { ActivePowersRow } from "./components/ActivePowersRow";
import { PlayerTokensRow } from "./components/PlayerTokensRow";

const isMobile = checkIsMobile();
const Backend: any = isMobile ? TouchBackend : HTML5Backend;

const Game = () => {
  const navigateTo = useNavigate();
  const { search } = useLocation();
  const { name, player } = qs.parse(search, {
    ignoreQueryPrefix: true,
  }) as Record<string, string>;
  const [cardToFade, setCardToFade] = useState<1 | 2 | 3 | 4>();
  const [powerToPlay, setPowerToPlay] = useState<CardClass>();
  const [fateToReveal, setFateToReveal] = useState<FateVal>();
  const [adjustPointsOpen, setAdjustPointsOpen] = useState(false);
  const [spectatorModalShown, setSpectatorModalShown] =
    useState<boolean>(false);
  const [playerId] = useState(
    player || window.localStorage.getItem("playerId") || "",
  );
  const game = useGame(name);
  const { value, updateScore, fadeCard, drawFate, playFate, playPower } = game;
  const { loading, discardFate, flipToken, attachPower, leaveGame } = game;
  const { revealFate, newGame, removeActivePowers, undoAction, endTurn } = game;
  const numberOfPlayers = Object.keys(value?.players || {}).length;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      window.onbeforeunload = (e: BeforeUnloadEvent) => {
        if (numberOfPlayers > 1) {
          e.preventDefault();
          e.returnValue = "Are you sure you want to leave the game?";
        }
      };
      window.onunload = () => {
        leaveGame(playerId);
      };
    }
  }, [leaveGame, playerId, numberOfPlayers]);

  if (!loading && !value) {
    return (
      <NoGame
        gameId={name}
        onContinue={() => {
          navigateTo("/");
        }}
      />
    );
  }

  if (!value)
    return (
      <Grid container justify="center" style={{ paddingTop: "4rem" }}>
        <CircularProgress color="secondary" size={65} />
      </Grid>
    );

  const { points, doom, deck, cards, powers, players } = value;
  const { playedOnHours, recentlyPlayed, activePowers, activePlayer } = value;
  const spectator = !players[playerId];
  const canJoin = Object.keys(players).length < 5;
  const { fates = [], tokens = [], color, revealed } = players[playerId] || {};
  const score = { points, doom };
  const sortedPlayers = sortPlayers(players, playerId);
  const revealedFateIndex = fates.indexOf(revealed!);
  const isCurrentTurn = playerId === activePlayer;
  const activePlayerName = players[activePlayer].playerName;

  let recentIndex = -1;
  if (1 === recentlyPlayed?.source && playedOnHours) {
    recentIndex = cards[1].fates.lastIndexOf(recentlyPlayed.fate);
  }

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
    const { snapshot, ...rest } = value;
    (rest as any).hasSnapshot = !!snapshot;
    // console.log(JSON.stringify(rest, null, 2));
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
          onExitGame={() => {
            leaveGame(playerId);
            navigateTo("/");
          }}
        />
        <Grid
          container
          direction="column"
          alignItems="center"
          style={{ paddingBottom: 24 }}>
          <PlayerTokensRow tokens={sortedPlayers} activePlayer={activePlayer} />
          <Grid container item justify="center">
            {deck.length > 0 && (
              <BaseCard
                card={deck[0]}
                transition="none"
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
              fateIndex={recentIndex}
              onDropFate={(val) => !spectator && playFate("hours", val)}
              onClick={beginAdjustScore}
              activePlayerName={activePlayerName}
            />
            {cardsIndices.map((i) => (
              <Card
                key={i}
                index={i}
                transition="fade"
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
          <Grid item container justify="center" direction="row">
            <ActivePowersRow
              powers={activePowers}
              canClear={!spectator}
              onClearPowers={() => !spectator && removeActivePowers()}
            />
            <Grid
              item
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                margin: "10px 0",
              }}>
              {powers.map((power) => (
                <Slide
                  key={power.name}
                  direction="left"
                  in
                  enter
                  appear
                  timeout={{ enter: 450 }}>
                  <BaseCard
                    card={power}
                    showPower
                    onLongPress={() => !spectator && setPowerToPlay(power)}
                    onContextMenu={(e) => {
                      if (spectator) return;

                      setPowerToPlay(power);
                      e.preventDefault();
                    }}
                  />
                </Slide>
              ))}
            </Grid>
          </Grid>
          <Grid
            container
            item
            justify="center"
            alignItems="center"
            style={{ padding: "2rem 0" }}>
            {fates.map((f, fIndex) => (
              <Fate
                key={f}
                num={f}
                highlight={revealedFateIndex === fIndex}
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
          <Grid container item justify="center">
            <TokenRow
              selections={tokens}
              color={color}
              onClick={(f: FateVal) =>
                !spectator && flipToken(playerId, f, !tokens[f])
              }
            />
          </Grid>
          {isCurrentTurn && (
            <Button
              title="Click to end your turn"
              onClick={() => endTurn(playerId)}
              color="primary"
              style={{ marginTop: 16 }}
              variant="contained">
              End Turn
            </Button>
          )}
        </Grid>
      </DndProvider>

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
          navigateTo(canJoin ? `/join${search}` : `/`);
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
    .map(([playerId, player]) => ({ playerId, player }));
  const indexOfPlayer = sorted.findIndex(
    ({ playerId: key }) => key === playerId,
  );

  if (indexOfPlayer === -1) return sorted;

  return sorted.slice(indexOfPlayer + 1).concat(sorted.slice(0, indexOfPlayer));
};

const cardsIndices: CardIndex[] = [1, 2, 3, 4];

export default Game;
