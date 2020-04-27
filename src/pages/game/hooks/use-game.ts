import { useObjectVal } from "react-firebase-hooks/database";
import { getGame } from "../../../services/firebase";
import { Card, cards } from "../../../services/game";

export function useGame(id: string) {
  const ref = getGame(id);
  const [value] = useObjectVal<GameState>(ref);

  const updateScore = (points: Score) => ref.update(points);

  return {
    value: {
      ...(value as GameState),
      deck: value?.deck.map((c) => Card.from(c as any)) ?? [],
      cards: {
        1: Card.from(value?.cards[1] ?? ({} as any)),
        2: Card.from(value?.cards[2] ?? ({} as any)),
        3: Card.from(value?.cards[3] ?? ({} as any)),
        4: Card.from(value?.cards[4] ?? ({} as any)),
      },
    },
    updateScore,
  };
}

interface GameState {
  points: number;
  doom: number;
  deck: Card[];
  cards: {
    1: Card;
    2: Card;
    3: Card;
    4: Card;
  };
}

type Score = Pick<GameState, "points" | "doom">;
