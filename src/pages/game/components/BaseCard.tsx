import React, { ComponentType, useState } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled, Grid, Dialog, Box } from "@material-ui/core";
import { useDrag } from "react-dnd";
import { PowerAdornment } from "./PowerAdornment";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useLongPress } from "./hooks/use-long-press";
import { useDragScroll } from "./hooks/use-drag-scroll";

export interface BaseCardProps {
  card: CardClass;
  showPower?: boolean;
  transition?: "fade" | "none";
  onLongPress?: Function;
}

export const BaseCard = React.forwardRef<
  any,
  BaseCardProps & ExtractProps<typeof Img>
>((props, ref) => {
  const { children, card, transition = "none", showPower, ...rest } = props;
  const { onLongPress, ...imgProps } = rest;
  const [preview, setPreview] = useState(false);
  const [{ isDragging }, drag, dragPreview] = useDrag(
    {
      type: "power",
      item: { type: "power", value: card },
      canDrag: card.canAttach && showPower,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    },
    [card.canAttach, showPower, card],
  );
  const longPress = useLongPress(onLongPress, !isDragging);
  useDragScroll(isDragging);

  return (
    <Card
      innerRef={(inst) => {
        drag(inst);
        dragPreview(inst);
      }}
      style={{ position: "relative", flexDirection: "column" }}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={card.name}
          enter={transition !== "none"}
          exit={transition !== "none"}
          timeout={
            transition === "none" ? { enter: 0, exit: 0, appear: 0 } : undefined
          }
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames={transition}>
          <StyledBox>
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
              {...longPress}
              {...imgProps}
            />
          </StyledBox>
        </CSSTransition>
      </SwitchTransition>

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
  height: "13.5rem",
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

const StyledBox = styled(Box)({
  width: "calc(7.83rem + 48px)",
  "&.fade-enter": {
    opacity: 0,
    transform: "translateY(24px)",
  },
  "&.fade-exit": {
    opacity: 1,
  },
  "&.fade-enter-active": {
    opacity: 1,
    transform: "translateY(0)",
  },
  "&.fade-exit-active": {
    opacity: 0,
  },
  "&.fade-enter-active, &.fade-exit-active": {
    transition: "all 450ms",
  },
});
