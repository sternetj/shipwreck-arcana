import { useObjectVal } from "react-firebase-hooks/database";
import {
  getGame,
  fates,
  defaultTokens,
  opponentColors,
} from "../../../services/firebase";
import { Card, cards } from "../../../services/game";
import { FateVal } from "../components/Fate";
import { DropFate, DropPower } from "../components/Card";
import { TokenColor } from "../components/token";
import { shuffle } from "../../../services/shuffle";

export function useGame(id: string) {
  const ref = getGame(id);
  const [raw, loading] = useObjectVal<GameState>(ref);
  const value = deserializeGame(raw);

  const updateScore = (points: Score) => ref.update({ ...points });

  const fadeCard = (index: CardIndex) => {
    if (!value) return;
    const snapshot = createSnapshot(value);
    const newCard = value.deck.shift();
    const cardToFade = value.cards[index];
    const discardFates = cardToFade.fates;
    cardToFade.fates = [];
    value.discard = (value.discard || []).concat(cardToFade.attachedPowers);
    cardToFade.attachedPowers = [];

    if (value.deck.length === 0) {
      value.deck = shuffle(value.discard);
      value.discard = [];
    }

    ref.update({
      snapshot,
      discard: value.discard,
      deck: value.deck,
      recentlyPlayed: null as any,
      powers: (value.powers || []).concat(cardToFade),
      fates: (value.fates || []).concat(discardFates),
      cards: {
        ...value.cards,
        [index]: newCard || null,
      },
    });
  };

  const playFate = (
    index: CardIndex | "hours",
    { value: fate, source }: DropFate,
  ) => {
    if (!value) return;
    const snapshot = createSnapshot(value);
    let playedOnHours: FateVal | null = null;

    if (index === "hours") {
      index = 1;
      playedOnHours = fate;
    }

    const cardToUpdate = value.cards[index];

    if (typeof source === "string") {
      const current = value.players[source];
      current.fates = current.fates || [];
      current.fates.splice(current.fates.indexOf(fate), 1);
      current.revealed = null as any;
      value.players[source] = current;
    } else {
      value.cards[source].removeFate(fate);
    }

    cardToUpdate.addFate(fate);

    let recentlyPlayed = value.recentlyPlayed || null;
    if (source !== index) {
      recentlyPlayed = {
        source: index,
        fate,
      };
    }

    ref.update({
      snapshot,
      playedOnHours,
      recentlyPlayed,
      cards: {
        ...value.cards,
        [index]: cardToUpdate,
      },
      players: value.players,
    });
  };

  const discardFate = ({ value: fate, source }: DropFate) => {
    if (!value) return;
    const snapshot = createSnapshot(value);

    if (typeof source === "string") {
      const current = value.players[source];
      current.fates = current.fates || [];
      current.fates.splice(current.fates.indexOf(fate), 1);
      current.revealed = null as any;
      value.players[source] = current;
    } else {
      value.cards[source].removeFate(fate);
    }

    ref.update({
      snapshot,
      fates: (value.fates || []).concat(fate),
      recentlyPlayed: null as any,
      cards: value.cards,
      players: value.players,
    });
  };

  const drawFate = (playerId: string) => {
    if (!value || !playerId) return;
    const snapshot = createSnapshot(value);
    const current = value.players[playerId];
    current.fates = current.fates || [];
    current.revealed = null as any;
    value.fates = shuffle(value.fates || []);

    if (value.fates?.length === 0) {
      alert("Bag is empty");
      return;
    }
    if (current.fates?.length > 1) {
      alert("You can only have a maximum of two fates at a time");
      return;
    }

    const drawn = value.fates.pop();
    ref.update({
      snapshot,
      fates: value.fates,
      recentlyPlayed: null as any,
      players: {
        ...value.players,
        [playerId]: {
          ...current,
          revealed: null as any,
          fates: current.fates.concat(drawn!),
        },
      },
    });
  };

  const flipToken = (playerId: string, fate: FateVal, flipToken: boolean) => {
    if (!value || !playerId) return;
    const current = value.players[playerId];
    current.tokens[fate] = flipToken;

    ref.update({
      players: {
        ...value.players,
        [playerId]: {
          ...current,
          tokens: current.tokens,
        },
      },
    });
  };

  const playPower = (power: Card) => {
    if (!value) return;
    const snapshot = createSnapshot(value);

    value.discard = (value.discard || []).concat(power);
    value.powers = value.powers || [];
    const index = value.powers.findIndex((c) => c.name === power.name);
    if (index >= 0) {
      const played = value.powers.splice(index, 1);
      value.activePowers = value.activePowers.concat(played);
    }

    if ((value.deck || []).length === 0) {
      value.deck = shuffle(value.discard);
      value.discard = [];
    }

    ref.update({
      snapshot,
      activePowers: value.activePowers,
      discard: value.discard,
      recentlyPlayed: null as any,
      deck: value.deck,
      powers: value.powers,
    });
  };

  const attachPower = (index: CardIndex, { value: power }: DropPower) => {
    if (!value) return;
    const snapshot = createSnapshot(value);

    const cardToUpdate = value.cards[index];
    cardToUpdate.addPower(power);

    value.powers = value.powers || [];
    const powerIndex = value.powers.findIndex((c) => c.name === power.name);
    if (powerIndex >= 0) {
      value.powers.splice(powerIndex, 1);
    }

    ref.update({
      snapshot,
      powers: value.powers,
      recentlyPlayed: null as any,
      cards: {
        ...value.cards,
        [index]: cardToUpdate,
      },
    });
  };

  const leaveGame = (playerId: string) => {
    if (!value) return;

    if (Object.keys(value.players).length > 1) {
      const { [playerId]: leaving, ...remainingPlayers } = value.players;
      const activePlayer =
        value.activePlayer === playerId
          ? getNextPlayer(value.players, playerId)
          : value.activePlayer;
      ref.update({
        snapshot: null,
        players: remainingPlayers,
        activePlayer,
      });
    } else {
      ref.remove();
    }
  };

  const newGame = () => {
    if (!value) return;

    const deck = shuffle(cards);
    const activeCards = {
      1: deck.shift(),
      2: deck.shift(),
      3: deck.shift(),
      4: deck.shift(),
    };

    Object.keys(value.players).forEach((pId) => {
      value.players[pId].fates = [];
      value.players[pId].tokens = defaultTokens as any;
      value.players[pId].revealed = null as any;
    });

    ref.update({
      recentlyPlayed: null,
      snapshot: null,
      playedOnHours: null,
      activePowers: [],
      activePlayer: getNextPlayer(value.players, value.activePlayer),
      powers: [],
      deck,
      players: value.players,
      discard: [],
      cards: activeCards,
      fates: shuffle(fates),
      doom: 0,
      points: 0,
    });
  };

  const revealFate = (playerId: string, fate: FateVal) => {
    if (!value || !playerId) return;
    const current = value.players[playerId];
    current.revealed = fate;

    ref.update({
      recentlyPlayed: null as any,
      players: {
        ...value.players,
        [playerId]: {
          ...current,
        },
      },
    });
  };

  const removeActivePowers = () => {
    const snapshot = createSnapshot(value);
    ref.update({
      snapshot,
      activePowers: null as any,
    });
  };

  const undoAction = () => {
    if (!value || !value.snapshot) return;
    const oldState = JSON.parse(atob(value.snapshot)) as GameState;
    const mergedPlayers = Object.entries(value.players)
      .map<[string, Player]>(([key, pVal]) => [
        key,
        {
          ...oldState.players[key],
          revealed: pVal.revealed || (null as any),
          tokens: pVal.tokens,
        },
      ])
      .reduce(
        (acc, [key, val]) => ({
          ...acc,
          [key]: val,
        }),
        {} as GameState["players"],
      );

    ref.set({
      ...oldState,
      points: value.points,
      doom: value.doom,
      players: mergedPlayers,
    });
  };

  const endTurn = (playerId: string) => {
    if (!value) return;
    const snapshot = createSnapshot(value);

    ref.update({
      snapshot,
      activePlayer: getNextPlayer(value.players, playerId),
    });
  };

  return {
    loading,
    value,
    updateScore,
    fadeCard,
    drawFate,
    playFate,
    discardFate,
    flipToken,
    playPower,
    attachPower,
    leaveGame,
    newGame,
    revealFate,
    removeActivePowers,
    undoAction,
    endTurn,
  };
}

const deserializeGame = (value: GameState | undefined) =>
  value && {
    ...value,
    discard: (value.discard || []).map((c) => Card.from(c)),
    deck: (value.deck || []).map((c) => Card.from(c)),
    powers: (value.powers || []).map((c) => Card.from(c)),
    activePowers: (value.activePowers || []).map((c) => Card.from(c)),
    cards: {
      1: Card.from(value.cards[1]),
      2: Card.from(value.cards[2]),
      3: Card.from(value.cards[3]),
      4: Card.from(value.cards[4]),
    },
  };

const createSnapshot = (state: GameState | undefined) => {
  if (!state) return null;

  const { snapshot, ...value } = state;
  return btoa(JSON.stringify(value));
};

const getNextPlayer = (players: GameState["players"], currentPlayer = "") => {
  const sorted = Object.entries(players)
    .sort(
      ([, { color: colorA }], [, { color: colorB }]) =>
        opponentColors.indexOf(colorA) - opponentColors.indexOf(colorB),
    )
    .map(([key]) => key);

  const nextPlayerIndex = sorted.indexOf(currentPlayer) + 1;

  return sorted.concat(sorted)[nextPlayerIndex];
};

export interface GameState {
  cards: {
    [index in CardIndex]: Card;
  };
  deck: Card[];
  discard: Card[];
  doom: number;
  fates: FateVal[];
  activePlayer: string;
  playedOnHours?: FateVal;
  recentlyPlayed?: {
    source: CardIndex;
    fate: FateVal;
  };
  players: {
    [playerId: string]: Player;
  };
  points: number;
  powers: Card[];
  activePowers: Card[];
  snapshot: string;
}

export interface Player {
  playerName: string;
  color: TokenColor;
  fates?: FateVal[];
  tokens: boolean[];
  revealed?: FateVal;
}

type Score = Pick<GameState, "points" | "doom">;
export type CardIndex = 1 | 2 | 3 | 4;
