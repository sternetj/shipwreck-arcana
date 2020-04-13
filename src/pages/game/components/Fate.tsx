import React, { FC } from "react";
import { styled } from "@material-ui/core";

export const Fate: FC<{ num: FateVal }> = ({ num }) => {
  return (
    <Tile
      style={{ background: `url('pieces/fates.png') ${tileToSprite[num]}` }}
    />
  );
};

const Tile = styled("div")({
  width: 37,
  height: 37,
  margin: 5,
});

type FateVal = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const tileToSprite = {
  1: "83px -1px",
  2: "0px 80px",
  3: "83px 80px",
  4: "38px 80px",
  5: "0px 39px",
  6: "83px 39px",
  7: "38px 39px",
};
