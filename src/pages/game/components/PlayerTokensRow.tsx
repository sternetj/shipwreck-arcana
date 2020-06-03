import React, { FC } from "react";
import { Grid, Box } from "@material-ui/core";
import { Player } from "../hooks/use-game";
import { TokenRow } from "./TokenRow";

interface Props {
  tokens: Player[];
}
export const PlayerTokensRow: FC<Props> = (props) => {
  const { tokens } = props;

  return (
    <Grid item container justify="center" style={{ padding: "2rem 48px" }}>
      {tokens.map(({ tokens: ots, playerName, color, fates, revealed }, i) => (
        <Box
          key={color}
          flex={1}
          maxWidth={390}
          minWidth={333}
          justifyContent="center"
          display="flex">
          <TokenRow
            color={color}
            tokens={fates}
            revealedIndex={fates?.indexOf(revealed as any)}
            selections={ots}
            name={playerName}
          />
        </Box>
      ))}
    </Grid>
  );
};
