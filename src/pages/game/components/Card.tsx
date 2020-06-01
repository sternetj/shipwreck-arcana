import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { Fate, FateVal } from "./Fate";
import { CardIndex, GameState } from "../hooks/use-game";
import { BaseCard } from "./BaseCard";
import { onLongPress } from "../../../services/long-press";

export interface CardProps {
  index: CardIndex | "hours";
  card: CardClass;
  acceptsDrop?: ("power" | "fate")[];
  showPower?: boolean;
  recentlyPlayed?: GameState["recentlyPlayed"];
  onClick?: (card: CardClass) => any;
  onDropFate?: (val: DropFate) => any;
  onDropPower?: (val: DropPower) => any;
}

export const Card: FC<CardProps> = (props) => {
  const { index, card, acceptsDrop = [], onClick, showPower = false } = props;
  const { onDropFate, onDropPower, recentlyPlayed } = props;
  const [{ canDrop }, drop] = useDrop({
    accept: ["fate", "power"],
    canDrop: (item: DropFate | DropPower) => acceptsDrop.includes(item.type),
    drop: (item: DropFate | DropPower) => {
      if (item.type === "fate") {
        onDropFate && onDropFate(item as DropFate);
      }
      if (item.type === "power") {
        onDropPower && onDropPower(item as DropPower);
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop() && monitor.isOver(),
    }),
  });

  let styles: React.CSSProperties = {};
  if (canDrop) {
    styles = {
      boxShadow: "0px 0px 6px 6px lightskyblue",
    };
  }

  let recentIndex = -1;
  if (recentlyPlayed) {
    recentIndex = card.fates.lastIndexOf(recentlyPlayed.fate);
  }

  return (
    <BaseCard
      card={card}
      showPower={showPower}
      ref={drop}
      style={styles}
      {...onLongPress(() => onClick && onClick(card))}
      onContextMenu={(e) => {
        if (onClick) {
          onClick(card);
          e.preventDefault();
        }
      }}>
      <FateRow container justify="center">
        {card.fates.map((f, k) => (
          <Fate
            key={k}
            num={f as any}
            source={index}
            highlight={k === recentIndex}
          />
        ))}
      </FateRow>
    </BaseCard>
  );
};

export interface DropFate {
  type: "fate";
  value: FateVal;
  source: CardIndex | "hours" | string;
}

export interface DropPower {
  type: "power";
  value: CardClass;
}

const FateRow = styled(Grid)({
  maxWidth: 150,
  margin: "0 auto",
});
