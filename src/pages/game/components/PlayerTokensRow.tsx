import React, { FC } from "react";
import { Grid, Box, styled } from "@material-ui/core";
import { Player } from "../hooks/use-game";
import { TokenRow } from "./TokenRow";
import { isMobile as checkIsMobile } from "is-mobile";

const isMobile = checkIsMobile();

interface Props {
  tokens: Player[];
}
export const PlayerTokensRow: FC<Props> = (props) => {
  const { tokens } = props;

  return (
    <Container item container justify="center">
      {tokens.map(({ tokens: ots, playerName, color, fates, revealed }, i) => (
        <Box
          key={color}
          flex={1}
          maxWidth={390}
          minWidth={357}
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
    </Container>
  );
};

const Container = styled(Grid)({
  padding: `${isMobile ? 3 : 2}rem 48px 2rem`,
});
