import React, { useState, FC } from "react";
import { Grid, styled, Card } from "@material-ui/core";
import Welcome from "./welcome";
import SwipeableViews from "react-swipeable-views";
import { createGame, joinGame, gameExists } from "../../services/firebase";
import EnterName from "./enter-name";
import EnterGameId from "./enter-name";
import { useHistory } from "react-router-dom";
import qs from "qs";
import { useLocation } from "react-router-dom";

enum Steps {
  GameName = 1,
  PlayerName = 2,
}

const JoinGame: FC = () => {
  const { search } = useLocation();
  const { player } = qs.parse(search, { ignoreQueryPrefix: true });
  const router = useHistory();
  const [slide, setSlide] = useState(0);
  const [type, setType] = useState<ConnectType>();
  const [gameId, setGameId] = useState("");
  const [errorText, setErrorText] = useState("");

  const onConnect = (type: ConnectType) => {
    setSlide(isCreate(type) ? Steps.PlayerName : Steps.GameName);
    setType(type);
  };

  const onSetGameId = async (id: string) => {
    const exists = await gameExists(id);
    if (exists) {
      setSlide(Steps.PlayerName);
      setGameId(id);
    } else {
      setErrorText("Game does not exist");
    }
  };

  const prompt = isCreate(type) ? "Create Game" : "Join Game";

  const onSubmit = async (name: string) => {
    const game: any = isCreate(type)
      ? createGame(name, player)
      : await joinGame(gameId, name, player);

    router.push(
      `/game?${qs.stringify({
        player,
        name: game.name,
      })}`,
    );
  };

  return (
    <Background>
      <Container container alignItems="center" justify="center">
        <StyledCard>
          <SwipeableViews index={slide}>
            <Welcome
              onJoin={() => onConnect("join")}
              onCreate={() => onConnect("create")}
            />
            <EnterGameId
              title="Enter Game Id"
              placeholder="trusty-iguana"
              label="Continue"
              error={errorText}
              onBack={() => setSlide(0)}
              onSubmit={onSetGameId}
            />
            <EnterName
              dataKey="playerName"
              title="Enter Your Name"
              label={prompt}
              onBack={() => setSlide(0)}
              onSubmit={onSubmit}
            />
          </SwipeableViews>
        </StyledCard>
      </Container>
    </Background>
  );
};

type ConnectType = "create" | "join";
const isCreate = (type?: ConnectType) => {
  return type === "create";
};

const StyledCard = styled(Card)({
  width: "320px",
  padding: "2rem",
});

const Container = styled(Grid)({
  height: "100vh",
});

const Background = styled(Grid)({
  width: "100%",
  height: "100vh",
});

export default JoinGame;
