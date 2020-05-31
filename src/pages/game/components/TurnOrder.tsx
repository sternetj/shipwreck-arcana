import React, { FC, useRef, useState } from "react";
import { Grid, Icon, Popover, Typography } from "@material-ui/core";

export const TurnOrder: FC = () => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <Grid
      direction="column"
      style={{ position: "absolute", right: 10, bottom: 10, display: "flex" }}>
      <Icon
        style={{ width: 50, height: 50 }}
        onPointerEnter={onOpen}
        onPointerLeave={onClose}
        onTouchStart={onOpen}
        onTouchEnd={onClose}
        innerRef={ref}>
        <img
          style={{ height: "100%" }}
          src="/pieces/turn-order.svg"
          alt="Turn Order Icon"
        />
      </Icon>
      <Popover
        style={{ pointerEvents: "none" }}
        open={open}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={onClose}
        disableRestoreFocus>
        <div style={{ padding: 8 }}>
          <Typography>Turn Order starting with Green</Typography>
        </div>
      </Popover>
    </Grid>
  );
};
