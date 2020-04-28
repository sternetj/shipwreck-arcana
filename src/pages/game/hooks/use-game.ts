import { useObjectVal } from "react-firebase-hooks/database";
import { getGame } from "../../../services/firebase";
import { Card, cards } from "../../../services/game";

export function useGame(id: string) {
  const ref = getGame(id);
  const [value] = useObjectVal<GameState>(ref);

  const updateScore = (points: Score) => ref.update(points);
  const fadeCard = (index: 1 | 2 | 3 | 4) => {
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

  return {
    value: value && {
      ...value,
      deck: (value.deck || []).map((c) => Card.from(c)),
      powers: (value.powers || []).map((c) => Card.from(c)),
      cards: {
        1: Card.from(value.cards[1]),
        2: Card.from(value.cards[2]),
        3: Card.from(value.cards[3]),
        4: Card.from(value.cards[4]),
      },
    },
    updateScore,
    fadeCard,
  };
}

interface GameState {
  points: number;
  doom: number;
  powers: Card[];
  deck: Card[];
  discard: Card[];
  cards: {
    1: Card;
    2: Card;
    3: Card;
    4: Card;
  };
}

type Score = Pick<GameState, "points" | "doom">;
