import React, { FC } from "react";
import { Grid, Typography, GridProps, styled } from "@material-ui/core";
import { Token, TokenColor } from "./token";
import { FateVal, Fate } from "./Fate";

interface Props {
  selections: boolean[];
  name?: string;
  tokens?: FateVal[];
  revealedIndex?: number;
  color: TokenColor;
  onClick?: (f: FateVal) => void;
  fullWidth?: boolean;
}
export const TokenRow: FC<Props> = (props) => {
  const { selections, name, color, fullWidth, onClick, tokens = [] } = props;
  const { revealedIndex } = props;

  let sizing: Pick<GridProps, "xs" | "md" | "sm"> = {
    xs: 12,
    md: 12,
    sm: 12,
  };

  if (!fullWidth) {
    sizing.md = 3;
    sizing.sm = 6;
  }

  return (
    <Grid item container alignItems="center" direction="column" {...sizing}>
      <Grid item container justify="center">
        {tokenVals.map((f) => (
          <Token
            key={f}
            num={f}
            color={color}
            flipped={selections[f]}
            onClick={() => onClick && onClick(f)}
          />
        ))}
      </Grid>
      <Grid item container justify="center" alignItems="center">
        {!!name && <Typography style={{ marginRight: 8 }}>{name}</Typography>}
        {tokens.map((f, index) =>
          index === revealedIndex ? (
            <Fate
              num={f}
              styles={{
                margin: 2,
                transform: "scale(0.65)",
              }}
            />
          ) : (
            <Tile />
          ),
        )}
      </Grid>
    </Grid>
  );
};

const tokenVals: FateVal[] = [1, 2, 3, 4, 5, 6, 7];

const Tile = styled("div")({
  width: 24,
  height: 24,
  margin: 2,
  background: `url('pieces/fate-back.png') 0 0/24px 24px`,
});
