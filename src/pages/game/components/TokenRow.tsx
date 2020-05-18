import React, { FC } from "react";
import { Grid, Typography } from "@material-ui/core";
import { Token, TokenColor } from "./token";
import { FateVal } from "./Fate";

interface Props {
  selections: boolean[];
  name?: string;
  color: TokenColor;
  onClick?: (f: FateVal) => void;
}
export const TokenRow: FC<Props> = ({ selections, name, color, onClick }) => {
  return (
    <Grid
      item
      container
      alignItems="center"
      direction="column"
      xs={12}
      md={3}
      sm={6}>
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
