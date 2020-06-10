import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { Fate, FateVal } from "./Fate";
import { CardIndex, GameState } from "../hooks/use-game";
import { BaseCard, BaseCardProps } from "./BaseCard";
import { onLongPress } from "../../../services/long-press";

export interface CardProps extends BaseCardProps {
  index: CardIndex | "hours";
  acceptsDrop?: ("power" | "fate")[];
  recentlyPlayed?: GameState["recentlyPlayed"];
  canFade?: boolean;
  onClick?: (card: CardClass) => any;
  onDropFate?: (val: DropFate) => any;
  onDropPower?: (val: DropPower) => any;
}

export const Card: FC<CardProps> = (props) => {
  const { index, card, acceptsDrop = [], onClick, showPower = false } = props;
  const { onDropFate, onDropPower, recentlyPlayed, transition } = props;
  const { canFade = true } = props;
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

  let title = "";
  let styles: React.CSSProperties = {};
  if (canDrop) {
    styles = {
      boxShadow: "0px 0px 6px 6px lightskyblue",
    };
  } else if (canFade && card.fadesAt === null) {
    title = "This card may fade";
    styles = {
      boxShadow: "0px 0px 5px 3px #ab9f00",
    };
  } else if (canFade && card.willFade) {
    title = "This card will fade";
    styles = {
      boxShadow: "0px 0px 5px 3px #cd3133",
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
      transition={transition}
      style={styles}
      title={title}
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
