import React, { FC } from "react";
import { Grid, Button, Typography, Link, styled } from "@material-ui/core";

interface WelcomeProps {
  onJoin: Function;
  onCreate: Function;
}

const Welcome: FC<WelcomeProps> = ({ onJoin, onCreate }) => {
  return (
    <Container container direction="column" alignItems="center">
      <Typography variant="h4">Shipwreck Arcana</Typography>
      <Typography variant="body1">A multiplayer co-op card game</Typography>
      <Grid container justify="space-around">
        <ActionButton onClick={() => onJoin()}>Join</ActionButton>
        <ActionButton onClick={() => onCreate()}>Create</ActionButton>
      </Grid>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.meromorphgames.com/shipwreck-arcana/rules">
        Rules
      </Link>
    </Container>
  );
};

const Container = styled(Grid)({
  "&>*:not(:last-child)": {
    paddingBottom: ".75rem",
  },
});

const ActionButton = styled(Button)({});
ActionButton.defaultProps = {
  variant: "outlined",
  size: "large",
};

export default Welcome;
