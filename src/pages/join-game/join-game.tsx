import React, { useState, FC } from "react";
import { Grid, styled, Card } from "@material-ui/core";
import Welcome from "./welcome";

const JoinGame: FC = () => {
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const welcome = !joining && !creating;

  return (
    <Background>
      <Container container alignItems="center" justify="center">
        <StyledCard>
          {welcome && (
            <Welcome
              onCreate={() => setCreating(true)}
              onJoin={() => setJoining(true)}
            />
          )}
          {joining && <>Join</>}
          {creating && <>Create</>}
        </StyledCard>
      </Container>
    </Background>
  );
};

const StyledCard = styled(Card)({
  padding: "1rem",
});

const Container = styled(Grid)({
  height: "100vh",
});

const Background = styled(Grid)({
  width: "100%",
  height: "100vh",
  backgroundColor: "#181818",
});

export default JoinGame;
