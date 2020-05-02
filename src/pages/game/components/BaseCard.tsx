import React, { FC, ComponentType } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid } from "@material-ui/core";

export interface BaseCardProps {
  card: CardClass;
  showPower?: boolean;
}

export const BaseCard = React.forwardRef<
  any,
  BaseCardProps & ExtractProps<typeof Img>
>(({ children, card, showPower, ...rest }, ref) => {
  return (
    <Grid direction="column" style={{ marginBottom: 19 }}>
      <Img
        ref={ref}
        src={showPower ? card.powerPath : card.cardPath}
        alt={showPower ? card.power : card.name}
        {...rest}
      />
      {children}
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

const t = React.forwardRef(() => <div></div>);
