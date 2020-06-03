import React, { FC, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Divider,
  styled,
  Slide,
} from "@material-ui/core";
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
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        {!!powers.length && (
          <StyledDivider style={{ marginBottom: -24, marginTop: 22 }} />
        )}
        <Grid item container justify="center" style={{ margin: "10px 0" }}>
          {powers.map((power) => (
            <Slide in={true} direction="left" exit={false} enter={true}>
              <BaseCard key={power.name} card={power} showPower />
            </Slide>
          ))}
        </Grid>
        {!!powers.length && (
          <>
            <Typography variant="body1" color="secondary">
              Active Powers
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
  // alignSelf: "stretch",
  // margin: "0 auto",
  marginTop: "-2px",
  width: "100%",
  borderBottom: "2px solid rgba(45, 153, 102, 0.24)",
});
