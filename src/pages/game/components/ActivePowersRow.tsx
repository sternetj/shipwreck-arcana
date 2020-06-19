import React, { FC, useState } from "react";
import { Grid, Button, Typography, styled, Fade } from "@material-ui/core";
import { Card } from "../../../services/game";
import { BaseCard } from "./BaseCard";
import { ConfirmDialog } from "./ConfirmDialog";
import { Divider } from "./Divider";

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
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        {!!powers.length && (
          <Divider style={{ marginBottom: -24, marginTop: 22 }} />
        )}
        <Grid item container justify="center" style={{ margin: "10px 0" }}>
          {powers.map((power) => (
            <Fade key={power.name} in appear>
              <BaseCard card={power} showPower />
            </Fade>
          ))}
        </Grid>
        {!!powers.length && (
          <>
            <Divider>
              <StyledText variant="body1" color="secondary">
                Active Powers
              </StyledText>
            </Divider>
            {canClear && (
              <Button
                title="Click to remove active powers"
                onClick={() => setOpen(true)}
                size="small"
                color="primary"
                variant="text">
                ( Clear )
              </Button>
            )}
          </>
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

const StyledText = styled(Typography)({
  margin: "0 8px",
});
