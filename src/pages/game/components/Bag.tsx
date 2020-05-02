import React, { FC } from "react";

interface Props {
  onClick: Function;
}

export const Bag: FC<Props> = ({ onClick }) => {
  return (
    <img
      onClick={() => onClick()}
      src="pieces/bag.png"
      style={{
        justifySelf: "flex-end",
      }}
      alt="draw-bag"
    />
  );
};
