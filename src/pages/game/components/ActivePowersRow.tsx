import React, { FC, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { Card } from "../../../services/game";
import { BaseCard } from "./BaseCard";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  powers: Card[];
  onClearPowers: Function;
}
export const ActivePowersRow: FC<Props> = (props) => {
  const { powers, onClearPowers } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Grid item container alignItems="center" direction="column">
        <Grid item container justify="center">
          {powers.map((power) => (
            <BaseCard card={power} showPower />
          ))}
        </Grid>
        {!!powers.length && (
          <Button
            onClick={() => setOpen(true)}
            color="primary"
            style={{ marginTop: 16 }}
            variant="contained">
            Clear Active Powers
          </Button>
        )}
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
