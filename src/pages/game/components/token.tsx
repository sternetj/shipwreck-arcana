import React, { FC } from "react";
import { styled } from "@material-ui/core";
import { FateVal } from "./Fate";
import ReactCardFlip from "react-card-flip";

interface Props {
  num: FateVal;
  color: TokenColor;
  flipped?: boolean;
  onClick?: Function;
  speed?: number;
}
export const Token: FC<Props> = (props) => {
  const { num: value, color, flipped, onClick, speed = 0.5 } = props;

  return (
    <ReactCardFlip
      isFlipped={flipped}
      flipDirection="vertical"
      flipSpeedBackToFront={speed}
      flipSpeedFrontToBack={speed}>
      <TileContainer>
        <Tile
          onClick={() => onClick && onClick()}
          style={{
            background: `url('pieces/tokens.png') ${tileXToSprite[value]} ${tileYToSprite[color]}`,
          }}
        />
      </TileContainer>

      <TileContainer>
        <Tile
          onClick={() => onClick && onClick()}
          style={{
            background: `url('pieces/${color}-back.png')`,
          }}
        />
      </TileContainer>
    </ReactCardFlip>
  );
};

export type TokenColor = "red" | "blue" | "gray" | "green" | "yellow";

const TileContainer = styled("div")({
  border: "1px solid rgba(0,0,0,0)",
  // width: 35,
});

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
