import React, { FC } from "react";
import { styled } from "@material-ui/core";
import { FateVal } from "./Fate";

interface Props {
  num: FateVal;
  color: TokenColor;
  flipped?: boolean;
  onClick?: Function;
}
export const Token: FC<Props> = (props) => {
  const { num: value, color, flipped, onClick } = props;

  return (
    <Tile
      onClick={() => onClick && onClick()}
      style={{
        background: flipped
          ? `url('pieces/${color}-back.png')`
          : `url('pieces/tokens.png') ${tileXToSprite[value]} ${tileYToSprite[color]}`,
      }}
    />
  );
};

export type TokenColor = "red" | "blue" | "gray" | "green" | "yellow";

const Tile = styled("div")({
  width: 35,
  height: 35,
  margin: 5,
});

const tileXToSprite = {
  1: "-2px",
  2: "-42px",
  3: "-82px",
  4: "-122px",
  5: "-162px",
  6: "-202px",
  7: "-243px",
};

const tileYToSprite = {
  yellow: "-1px",
  blue: "148px",
  green: "111px",
  gray: "75px",
  red: "37px",
};
