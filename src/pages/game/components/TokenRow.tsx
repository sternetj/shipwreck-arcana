import React, { FC } from "react";
import { Grid, Typography, styled } from "@material-ui/core";
import { Token, TokenColor } from "./token";
import { FateVal, Fate } from "./Fate";

interface Props {
  selections: boolean[];
  name?: string;
  tokens?: FateVal[];
  revealedIndex?: number;
  color: TokenColor;
  onClick?: (f: FateVal) => void;
}
export const TokenRow: FC<Props> = (props) => {
  const { selections, name, color, onClick, tokens = [] } = props;
  const { revealedIndex } = props;

  return (
    <Grid
      item
      container
      alignItems="center"
      direction="column"
      style={{ maxWidth: 357 }}>
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
      {!!name && (
        <FateRow item container justify="center" alignItems="center">
          <Typography style={{ marginRight: 8 }}>{name}</Typography>
          {tokens.map((f, index) =>
            index === revealedIndex ? (
              <Fate
                key={index}
                num={f}
                styles={{
                  margin: 2,
                  transform: "scale(0.65)",
                }}
              />
            ) : (
              <Tile key={index} />
            ),
          )}
        </FateRow>
      )}
    </Grid>
  );
};

const tokenVals: FateVal[] = [1, 2, 3, 4, 5, 6, 7];

const FateRow = styled(Grid)({
  height: 41,
});

const Tile = styled("div")({
  width: 24,
  height: 24,
  margin: 2,
  background: `url('pieces/fate-back.png') 0 0/24px 24px`,
});
