import React, { FC } from "react";
import { styled, Fade } from "@material-ui/core";
import { useDrag } from "react-dnd";
import { CardIndex } from "../hooks/use-game";
import { useLongPress } from "./hooks/use-long-press";
import { useDragScroll } from "./hooks/use-drag-scroll";
interface Props {
  num: FateVal;
  source?: CardIndex | string;
  highlight?: boolean;
  styles?: React.CSSProperties;
  onClick?: Function;
}
export const Fate: FC<Props> = (props) => {
  const { num: value, source, styles, onClick, highlight } = props;
  const [{ isDragging }, drag] = useDrag({
    item: { type: "fate", value, source },
    canDrag: !!source,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const handler = onClick || (() => {});
  const longPressProps = useLongPress(handler, !isDragging);
  useDragScroll(isDragging);

  return (
    <>
      <Fade
        in={true}
        timeout={{
          appear: 0,
          enter: 350,
          exit: 350,
        }}>
        <Tile
          ref={drag}
          {...longPressProps}
          onContextMenu={(e) => {
            handler();
            e.preventDefault();
          }}
          style={{
            background: `url('pieces/fates.png') ${tileToSprite[value]}`,
            boxShadow: highlight ? "0px 0px 3px 2px #2d9966" : undefined,
            ...styles,
          }}
        />
      </Fade>
    </>
  );
};

const Tile = styled("div")({
  width: 37,
  height: 37,
  margin: 5,
});

export type FateVal = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const tileToSprite = {
  1: "83px -1px",
  2: "0px 80px",
  3: "83px 80px",
  4: "38px 80px",
  5: "0px 39px",
  6: "83px 39px",
  7: "38px 39px",
};
