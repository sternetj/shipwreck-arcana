import React, { ComponentType, useState } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid, Dialog } from "@material-ui/core";
import { useDrag } from "react-dnd";
import { PowerAdornment } from "./PowerAdornment";

export interface BaseCardProps {
  card: CardClass;
  showPower?: boolean;
}

export const BaseCard = React.forwardRef<
  any,
  BaseCardProps & ExtractProps<typeof Img>
>(({ children, card, showPower, ...rest }, ref) => {
  const [preview, setPreview] = useState(false);
  const [, drag] = useDrag({
    item: { type: "power", value: card },
    canDrag: card.canAttach && showPower,
  });

  return (
    <Card direction="column" innerRef={drag} style={{ position: "relative" }}>
      <Adornments container direction="row" justify="flex-end">
        {card.attachedPowers.map((p) => (
          <PowerAdornment card={p} />
        ))}
      </Adornments>
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
    </Card>
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

const Adornments = styled(Grid)({
  position: "absolute",
  right: 36,
  top: -1,
});

const Card = styled(Grid)({
  position: "relative",
  cursor: "pointer",
});
