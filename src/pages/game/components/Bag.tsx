import React, { FC } from "react";
import { useDrop } from "react-dnd";
import { DropFate } from "./Card";

interface Props {
  onClick: Function;
  onDropFate: (val: DropFate) => any;
}

export const Bag: FC<Props> = ({ onClick, onDropFate }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "fate",
    drop: (item) => onDropFate(item as DropFate),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  let styles = {};
  if (isOver) {
    styles = {
      filter: "drop-shadow(0px 0px 6px lightskyblue)",
      " -webkit-filter": "drop-shadow(0px 0px 6px lightskyblue)",
    };
  }

  return (
    <img
      ref={drop}
      onClick={() => onClick()}
      src={`pieces/bag.png`}
      style={styles}
      alt="draw-bag"
    />
  );
};
