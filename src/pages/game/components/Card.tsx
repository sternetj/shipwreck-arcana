import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { Fate, FateVal } from "./Fate";
import { CardIndex } from "../hooks/use-game";
import { BaseCard } from "./BaseCard";

export interface CardProps {
  index: CardIndex | "hours";
  card: CardClass;
  allowsDrop?: boolean;
  showPower?: boolean;
  onClick?: (card: CardClass) => any;
  onDropFate?: (val: DropValue) => any;
}

export const Card: FC<CardProps> = ({
  index,
  card,
  allowsDrop = false,
  onClick,
  showPower = false,
  onDropFate,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "fate",
    canDrop: () => allowsDrop,
    drop: (item) => onDropFate && onDropFate(item as DropValue),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  let styles: React.CSSProperties = {};
  if (allowsDrop && isOver) {
    styles = {
      boxShadow: "0px 0px 6px 6px lightskyblue",
    };
  }

  return (
    <BaseCard
      card={card}
      showPower={showPower}
      ref={drop}
      style={styles}
      onContextMenu={(e) => {
        if (onClick) {
          onClick(card);
          e.preventDefault();
        }
      }}>
      <FateRow container justify="center">
        {card.fates.map((f, k) => (
          <Fate key={k} num={f as any} source={index} />
        ))}
      </FateRow>
    </BaseCard>
  );
};

export interface DropValue {
  type: "fate";
  value: FateVal;
  source: CardIndex | "hours" | string;
}

const FateRow = styled(Grid)({
  maxWidth: 150,
  margin: "0 auto",
});
