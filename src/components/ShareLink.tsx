import React, { FC, useRef, useState } from "react";
import FilterNone from "@material-ui/icons/FilterNone";
import {
  styled,
  FilledInput,
  Grid,
  Typography,
  GridProps,
  Popper,
  Fade,
} from "@material-ui/core";

interface Props {
  gameId: string;
  style: GridProps["style"];
}

export const ShareLink: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const copyInput = useRef<HTMLInputElement>();
  const { gameId, style } = props;

  return (
    <Grid container justify="center" style={style}>
      <Typography variant="caption">
        Click the <b>join</b> link to share it with your friends
      </Typography>
      <Input
        value={`${window.location.origin}/join?name=${gameId}`}
        readOnly
        fullWidth
        color="secondary"
        inputRef={copyInput}
        onClick={() => {
          setOpen(true);
          const start = copyInput.current?.selectionStart || 0;
          const end = copyInput.current?.selectionEnd || 0;
          copyInput.current?.select();
          document.execCommand("copy");
          copyInput.current?.setSelectionRange(start, end);
          setTimeout(() => setOpen(false), 1250);
        }}
        endAdornment={<FilterNone />}
      />
      <Popper
        open={open}
        anchorEl={copyInput.current?.parentElement}
        placement="right"
        transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Notification>You copied the link!</Notification>
          </Fade>
        )}
      </Popper>
    </Grid>
  );
};

const Input = styled(FilledInput)({
  "&&& *": {
    cursor: "pointer",
  },
});

const Notification = styled("div")({
  marginLeft: 8,
  padding: "1rem",
  backgroundColor: "rgba(0,0,0,0.85)",
});
