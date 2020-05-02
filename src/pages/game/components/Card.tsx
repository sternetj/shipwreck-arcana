import React, { FC } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { Fate, FateVal } from "./Fate";

export interface CardProps {
  card: CardClass;
  allowsDrop?: boolean;
  showPower?: boolean;
  onClick?: (card: CardClass) => any;
  onDropFate?: (fate: FateVal) => any;
}

export const Card: FC<CardProps> = ({
  card,
  allowsDrop = false,
  onClick,
  showPower = false,
  onDropFate,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "fate",
    canDrop: () => allowsDrop,
    drop: (item) => onDropFate && onDropFate((item as any).value),
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
    <Grid direction="column" style={{ marginBottom: 19 }}>
      <Img
        ref={drop}
        style={styles}
        src={showPower ? card.powerPath : card.cardPath}
        alt={showPower ? card.power : card.name}
        onClick={() => onClick && onClick(card)}
      />
      <FateRow container justify="center">
        {card.fates.map((f, k) => (
          <Fate key={k} num={f as any} />
        ))}
      </FateRow>
    </Grid>
  );
};

const FateRow = styled(Grid)({
  maxWidth: 150,
  marginTop: 0,
});

const Img = styled("img")({
  boxSizing: "border-box",
  minHeight: 170,
  height: "25vh",
  margin: "24px",
  marginBottom: 0,
});
