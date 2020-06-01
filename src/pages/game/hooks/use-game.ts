import { useObjectVal } from "react-firebase-hooks/database";
import { getGame, fates, defaultTokens } from "../../../services/firebase";
import { Card, cards } from "../../../services/game";
import { FateVal } from "../components/Fate";
import { DropFate, DropPower } from "../components/Card";
import { helpers } from "faker";
import { TokenColor } from "../components/token";

export function useGame(id: string) {
  const ref = getGame(id);
  const [raw, loading] = useObjectVal<GameState>(ref);
  console.log(raw);
  const value = deserializeGame(raw);

  const updateScore = (points: Score) => ref.update(points);

  const fadeCard = (index: CardIndex) => {
    if (!value) return;
    const newCard = value.deck.shift();
    const cardToFade = value.cards[index];
    const discardFates = cardToFade.fates;
    cardToFade.fates = [];
    value.discard = (value.discard || []).concat(cardToFade.attachedPowers);
    cardToFade.attachedPowers = [];

    if (value.deck.length === 0) {
      value.deck = helpers.shuffle(value.discard);
      value.discard = [];
    }

    ref.update({
      discard: value.discard,
      deck: value.deck,
      powers: (value.powers || []).concat(cardToFade),
      fates: (value.fates || []).concat(discardFates),
      cards: {
        ...value.cards,
        [index]: newCard,
      },
    });
  };

  const playFate = (
    index: CardIndex | "hours",
    { value: fate, source }: DropFate,
  ) => {
    if (!value) return;
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

    ref.update({
      playedOnHours,
      cards: {
        ...value.cards,
        [index]: cardToUpdate,
      },
      players: value.players,
    });
  };

  const discardFate = ({ value: fate, source }: DropFate) => {
    if (!value) return;

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
      fates: (value.fates || []).concat(fate),
      cards: value.cards,
      players: value.players,
    });
  };

  const drawFate = (playerId: string) => {
    if (!value || !playerId) return;
    const current = value.players[playerId];
    current.fates = current.fates || [];
    current.revealed = null as any;
    value.fates = helpers.shuffle(value.fates || []);

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
      fates: value.fates,
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
      fates: value.fates,
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

    value.discard = (value.discard || []).concat(power);
    value.powers = value.powers || [];
    const index = value.powers.findIndex((c) => c.name === power.name);
    if (index >= 0) {
      value.powers.splice(index, 1);
    }

    if ((value.deck || []).length === 0) {
      value.deck = helpers.shuffle(value.discard);
      value.discard = [];
    }

    ref.update({
      discard: value.discard,
      deck: value.deck,
      powers: value.powers,
    });
  };

  const attachPower = (index: CardIndex, { value: power }: DropPower) => {
    if (!value) return;

    const cardToUpdate = value.cards[index];
    cardToUpdate.addPower(power);

    value.powers = value.powers || [];
    const powerIndex = value.powers.findIndex((c) => c.name === power.name);
    if (powerIndex >= 0) {
      value.powers.splice(powerIndex, 1);
    }

    ref.update({
      powers: value.powers,
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
      ref.update({
        players: remainingPlayers,
      });
    } else {
      ref.remove();
    }
  };

  const newGame = () => {
    if (!value) return;

    const deck = helpers.shuffle(cards);
    const activeCards = {
      1: deck.shift(),
      2: deck.shift(),
      3: deck.shift(),
      4: deck.shift(),
    };

    Object.keys(value.players).forEach((pId) => {
      value.players[pId].fates = [];
      value.players[pId].tokens = defaultTokens as any;
    });

    ref.update({
      powers: [],
      deck,
      players: value.players,
      discard: [],
      cards: activeCards,
      fates: helpers.shuffle(fates),
      doom: 0,
      points: 0,
    });
  };

  const revealFate = (playerId: string, fate: FateVal) => {
    if (!value || !playerId) return;
    const current = value.players[playerId];
    current.revealed = fate;

    ref.update({
      players: {
        ...value.players,
        [playerId]: {
          ...current,
        },
      },
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
  };
}

const deserializeGame = (value: GameState | undefined) =>
  value && {
    discard: (value.discard || []).map((c) => Card.from(c)),
    ...value,
    deck: (value.deck || []).map((c) => Card.from(c)),
    powers: (value.powers || []).map((c) => Card.from(c)),
    cards: {
      1: Card.from(value.cards[1]),
      2: Card.from(value.cards[2]),
      3: Card.from(value.cards[3]),
      4: Card.from(value.cards[4]),
    },
  };

export interface GameState {
  cards: {
    [index in CardIndex]: Card;
  };
  deck: Card[];
  discard: Card[];
  doom: number;
  fates: FateVal[];
  playedOnHours?: FateVal;
  players: {
    [playerId: string]: {
      playerName: string;
      color: TokenColor;
      fates?: FateVal[];
      tokens: boolean[];
      revealed?: FateVal;
    };
  };
  points: number;
  powers: Card[];
}

type Score = Pick<GameState, "points" | "doom">;
export type CardIndex = 1 | 2 | 3 | 4;
