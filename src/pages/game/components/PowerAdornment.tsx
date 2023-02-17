import React, { useState } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid, Dialog } from "@material-ui/core";

export interface BaseCardProps {
  card: CardClass;
  children?: React.ReactNode;
}

export const PowerAdornment = ({ children, card }: BaseCardProps) => {
  const [preview, setPreview] = useState(false);

  return (
    <Grid>
      <Adornment
        title={card.power}
        style={{
          background: `url('${card.powerPath}') 48px 52px`,
        }}
        onClick={() => setPreview(true)}
      />
      {children}
      <Dialog open={preview} onClose={() => setPreview(false)}>
        <img
          onClick={() => setPreview(false)}
          style={{ height: "75vh" }}
          src={card.powerPath}
          alt={card.power}
        />
      </Dialog>
    </Grid>
  );
};

const Adornment = styled("div")({
  width: 32,
  height: 35,
  border: "3px solid #cd3133",
  borderRadius: 5,
  margin: 5,
});
