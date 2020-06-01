import React, { FC, useState } from "react";
import { Grid, Button, Typography, Divider, styled } from "@material-ui/core";
import { Card } from "../../../services/game";
import { BaseCard } from "./BaseCard";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  powers: Card[];
  canClear: boolean;
  onClearPowers: Function;
}
export const ActivePowersRow: FC<Props> = (props) => {
  const { powers, onClearPowers, canClear } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Grid item container alignItems="center" direction="column">
        {!!powers.length && <StyledDivider />}
        <Grid item container justify="center">
          {powers.map((power) => (
            <BaseCard key={power.name} card={power} showPower />
          ))}
        </Grid>
        {!!powers.length && canClear && (
          <Button
            onClick={() => setOpen(true)}
            color="primary"
            style={{ marginTop: 16 }}
            variant="contained">
            Clear Active Powers
          </Button>
        )}
        {!!powers.length && !canClear && (
          <>
            <Typography
              variant="h6"
              color="secondary"
              style={{ marginTop: 16 }}>
              Active Powers
            </Typography>
          </>
        )}
        {!!powers.length && <StyledDivider />}
      </Grid>

      <ConfirmDialog
        prompt="Clear all active Powers?"
        open={open}
        onConfirm={() => {
          onClearPowers();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

const StyledDivider = styled(Divider)({
  alignSelf: "stretch",
  margin: "0 20vw ",
  marginTop: "1.5rem",
  backgroundColor: "rgba(45, 153, 102, 0.24)",
});
