import React, { FC } from "react";
import { Grid, Button } from "@material-ui/core";

interface WelcomeProps {
  onJoin: Function;
  onCreate: Function;
}

const Welcome: FC<WelcomeProps> = ({ onJoin, onCreate }) => {
  return (
    <Grid>
      <Button onClick={() => onJoin()}>Join</Button>
      <Button onClick={() => onCreate()}>Create</Button>
    </Grid>
  );
};

export default Welcome;
