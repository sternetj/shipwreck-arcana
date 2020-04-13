import React, { FC, useState, HTMLProps, ImgHTMLAttributes } from "react";
import { Card as CardClass } from "../../../services/game";
import { styled } from "@material-ui/core";

interface Props {
  card: CardClass;
  dropTarget?: boolean;
}

export const Card: FC<Props> = ({ card, dropTarget }) => {
  const [dropTargetStyles, setStyles] = useState<React.CSSProperties>({});
  let additionalProps: typeof Img.defaultProps = {};

  if (dropTarget) {
    additionalProps = {
      ...additionalProps,
      onDragEnter: () =>
        setStyles({
          boxShadow: "0px 0px 6px 6px lightskyblue",
        }),
      onDragLeave: () => setStyles({}),
    };
  }

  return (
    <Img
      {...additionalProps}
      style={dropTargetStyles}
      src={card.path}
      alt={card.name}
    />
  );
};

const Img = styled("img")({
  boxSizing: "border-box",
  width: "calc(16.667vw - 48px)",
  margin: 24,
});
