import React, { CSSProperties } from "react";
import { styled, Grid } from "@material-ui/core";

interface Props {
  style?: CSSProperties;
  children?: React.ReactNode;
}
export const Divider = (props: Props) => {
  const { children, style } = props;

  return (
    <Grid container alignItems="center">
      <StyledDivider style={style} />
      {children}
      <StyledDivider style={style} />
    </Grid>
  );
};

const StyledDivider = styled("div")({
  flex: 1,
  borderBottom: "2px solid rgba(45, 153, 102, 0.24)",
});
