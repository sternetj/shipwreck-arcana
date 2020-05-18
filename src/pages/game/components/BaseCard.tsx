import React, { ComponentType, useState } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid, Dialog } from "@material-ui/core";

export interface BaseCardProps {
  card: CardClass;
  showPower?: boolean;
}

export const BaseCard = React.forwardRef<
  any,
  BaseCardProps & ExtractProps<typeof Img>
>(({ children, card, showPower, ...rest }, ref) => {
  const [preview, setPreview] = useState(false);

  return (
    <Grid direction="column">
      <Img
        ref={ref}
        src={showPower ? card.powerPath : card.cardPath}
        alt={showPower ? card.power : card.name}
        onClick={() => setPreview(true)}
        {...rest}
      />
      {children}
      <Dialog open={preview} onClose={() => setPreview(false)}>
        <img
          onClick={() => setPreview(false)}
          style={{ height: "75vh" }}
          src={showPower ? card.powerPath : card.cardPath}
          alt={showPower ? card.power : card.name}
        />
      </Dialog>
    </Grid>
  );
});

type ExtractProps<T> = T extends ComponentType<infer P> ? P : never;

const Img = styled("img")({
  boxSizing: "border-box",
  minHeight: 170,
  height: "25vh",
  margin: "24px",
  marginBottom: 0,
});
