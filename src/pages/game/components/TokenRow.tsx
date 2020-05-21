import React, { FC } from "react";
import { Grid, Typography, GridProps } from "@material-ui/core";
import { Token, TokenColor } from "./token";
import { FateVal } from "./Fate";

interface Props {
  selections: boolean[];
  name?: string;
  color: TokenColor;
  onClick?: (f: FateVal) => void;
  fullWidth?: boolean;
}
export const TokenRow: FC<Props> = (props) => {
  const { selections, name, color, fullWidth, onClick } = props;

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
      {!!name && <Typography>{name}</Typography>}
    </Grid>
  );
};

const tokenVals: FateVal[] = [1, 2, 3, 4, 5, 6, 7];
