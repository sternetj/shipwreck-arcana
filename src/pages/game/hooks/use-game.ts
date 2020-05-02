import { useObjectVal } from "react-firebase-hooks/database";
import { getGame } from "../../../services/firebase";
import { Card } from "../../../services/game";
import { FateVal } from "../components/Fate";

export function useGame(id: string) {
  const ref = getGame(id);
  const [raw] = useObjectVal<GameState>(ref);
  const value = deserializeGame(raw);

  const updateScore = (points: Score) => ref.update(points);
  const fadeCard = (index: CardIndex) => {
    if (!value) return;
    const newCard = value.deck.shift();
    ref.update({
      deck: value.deck,
      powers: (value.powers || []).concat(value.cards[index]),
      cards: {
        ...value.cards,
        [index]: newCard,
      },
    });
  };

  const playFate = (playerId: string, index: CardIndex, fate: FateVal) => {
    if (!value) return;
    const cardToUpdate = value.cards[index];
    const current = value.players[playerId];

    current.fates = current.fates || [];
    current.fates.splice(current.fates.indexOf(fate), 1);
    cardToUpdate.addFate(fate);

    ref.update({
      cards: {
        ...value.cards,
        [index]: cardToUpdate,
      },
      players: {
        ...value.players,
        [playerId]: {
          ...current,
          fates: current.fates,
        },
      },
    });
  };

  const drawFate = (playerId: string) => {
    if (!value || !playerId) return;
    const current = value.players[playerId];
    current.fates = current.fates || [];
    value.fates = value.fates || [];

    if (value.fates?.length === 0) {
      alert("Bag is empty");
      return;
    }
    if (current.fates?.length > 1) {
      alert("You can only have a maximum of two fates at a time");
      return;
    }

    const drawn = value.fates.shift();
    ref.update({
      fates: value.fates,
      players: {
        ...value.players,
        [playerId]: {
          ...current,
          fates: current.fates.concat(drawn!),
        },
      },
    });
  };

  return {
    value,
    updateScore,
    fadeCard,
    drawFate,
    playFate,
  };
}

const deserializeGame = (value: GameState | undefined) =>
  value && {
    discard: [],
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

interface GameState {
  points: number;
  doom: number;
  powers: Card[];
  deck: Card[];
  discard: Card[];
  fates: FateVal[];
  players: {
    [playerId: string]: {
      playerName: string;
      fates?: FateVal[];
    };
  };
  cards: {
    [index in CardIndex]: Card;
  };
}

type Score = Pick<GameState, "points" | "doom">;
export type CardIndex = 1 | 2 | 3 | 4;
