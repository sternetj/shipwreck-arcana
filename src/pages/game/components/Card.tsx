import React, { FC, useState } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { Fate, FateVal } from "./Fate";

export interface CardProps {
  card: CardClass;
  allowsDrop?: boolean;
  showPower?: boolean;
  onClick?: (card: CardClass) => any;
}

export const Card: FC<CardProps> = ({
  card,
  allowsDrop = false,
  onClick,
  showPower = false,
}) => {
  const [fates, setFates] = useState<FateVal[]>([]);
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: "fate",
    canDrop: () => allowsDrop,
    drop(item, monitor) {
      setFates(fates.concat((item as any).value));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  let styles: React.CSSProperties = {};
  if (allowsDrop && isOver) {
    styles = {
      boxShadow: "0px 0px 6px 6px lightskyblue",
    };
  }

  return (
    <Grid container direction="column" style={{ marginBottom: 19 }}>
      <Img
        ref={drop}
        style={styles}
        src={showPower ? card.powerPath : card.cardPath}
        alt={showPower ? card.power : card.name}
        onClick={() => onClick && onClick(card)}
      />
      <FateRow container justify="center">
        {fates.map((f, k) => (
          <Fate key={k} num={f as any} />
        ))}
      </FateRow>
    </Grid>
  );
};

const FateRow = styled(Grid)({
  marginTop: 0,
});

const Img = styled("img")({
  boxSizing: "border-box",
  width: "calc(16.667vw - 48px)",
  margin: 24,
  marginBottom: 0,
});
