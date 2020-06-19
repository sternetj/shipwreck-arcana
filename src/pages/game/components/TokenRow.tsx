import React, { FC } from "react";
import { Grid, styled, Box } from "@material-ui/core";
import { Token, TokenColor } from "./token";
import { FateVal, Fate } from "./Fate";
import { Divider } from "./Divider";

interface Props {
  selections: boolean[];
  name?: string;
  tokens?: FateVal[];
  revealedIndex?: number;
  color: TokenColor;
  onClick?: (f: FateVal) => void;
  activeTurn?: boolean;
}
export const TokenRow: FC<Props> = (props) => {
  const { selections, name, color, onClick, tokens = [] } = props;
  const { revealedIndex, activeTurn } = props;

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
          {activeTurn && (
            <Grid
              item
              container
              style={{ marginBottom: 4, alignSelf: "flex-start" }}>
              <Divider>
                <ActivePlayer>{name}'s Turn</ActivePlayer>
              </Divider>
            </Grid>
          )}
          {!activeTurn && <Name>{name}</Name>}
          {tokens.map((f, index) =>
            index === revealedIndex ? (
              <Box width={24} height={24} margin={"2px"}>
                <Fate
                  key={index}
                  num={f}
                  styles={{
                    margin: 0,
                    transform: "scale(0.65)",
                    transformOrigin: "top left",
                  }}
                />
              </Box>
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

const Name = styled(Grid)({
  marginRight: 8,
});

const ActivePlayer = styled(Grid)({
  margin: "0 8px",
});

const Tile = styled("div")({
  width: 24,
  height: 24,
  margin: 2,
  background: `url('pieces/fate-back.png') 0 0/24px 24px`,
});
