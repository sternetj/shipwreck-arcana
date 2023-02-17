import React, { useState, FC, useEffect } from "react";
import { Grid, styled, Card, Typography } from "@material-ui/core";
import Welcome from "./welcome";
// import SwipeableViews from "react-swipeable-views";
import {
  createGame,
  joinGame,
  gameExists,
  generateGameName,
} from "../../services/firebase";
import EnterName from "./enter-name";
import EnterGameId from "./enter-name";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";
import { ShareLink } from "../../components/ShareLink";

enum Steps {
  GameName = 1,
  PlayerName = 2,
}

const JoinGame: FC = () => {
  const { search } = useLocation();
  const { player, name } = qs.parse(search, {
    ignoreQueryPrefix: true,
  }) as Record<string, string>;
  const navigateTo = useNavigate();
  const [slide, setSlide] = useState(0);
  const [type, setType] = useState<ConnectType>();
  const [directLink, setDirectLink] = useState<boolean>();
  const [gameId, setGameId] = useState(name || "");
  const [errorText, setErrorText] = useState<string>();

  useEffect(() => {
    if (gameId) {
      gameExists(gameId).then((exists) => {
        if (exists) {
          setSlide(Steps.PlayerName);
          setType("join");
          setDirectLink(true);
        } else {
          alert(`Could not find a game with id "${gameId}"`);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = (type: ConnectType) => {
    if (isCreate(type)) {
      setGameId(generateGameName());
      setSlide(Steps.PlayerName);
    } else {
      setSlide(Steps.GameName);
    }
    setType(type);
  };

  const onSetGameId = async (id: string) => {
    const upperId = id?.toUpperCase();
    setErrorText(undefined);
    const exists = await gameExists(upperId);
    if (exists) {
      setSlide(Steps.PlayerName);
      setGameId(upperId);
    } else {
      setErrorText("Game does not exist");
    }
  };

  const prompt = isCreate(type) ? "Create Game" : "Join Game";

  const onSubmit = async (name: string) => {
    try {
      const game: any = isCreate(type)
        ? createGame(gameId, name, player)
        : await joinGame(gameId, name, player);

      navigateTo(
        `/game?${qs.stringify({
          player,
          name: game.name,
        })}`,
      );
    } catch {
      alert("Game is already full. Please Join or Create a different game.");
    }
  };

  return (
    <Background>
      <Container
        container
        alignItems="center"
        justify="center"
        direction="column">
        {directLink && (
          <Typography variant="h5" style={{ padding: "0.5rem" }}>
            Joining game <Highlight>{gameId}</Highlight>
          </Typography>
        )}
        <StyledCard>
          {/* <SwipeableViews index={slide}> */}
          {slide === 0 && (
            <Welcome
              onJoin={() => onConnect("join")}
              onCreate={() => onConnect("create")}
            />
          )}
          {slide === 1 ? (
            <EnterGameId
              title="Enter Game Id"
              placeholder="AAAA"
              label="Continue"
              error={errorText}
              onBack={() => setSlide(0)}
              onSubmit={onSetGameId}
            />
          ) : (
            <></>
          )}
          {slide === 2 && (
            <EnterName
              dataKey="playerName"
              title="Enter Your Name"
              label={prompt}
              onBack={() => setSlide(0)}
              onSubmit={onSubmit}>
              {isCreate(type) && (
                <ShareLink gameId={gameId} style={{ padding: "1rem 0" }} />
              )}
            </EnterName>
          )}
          {/* </SwipeableViews> */}
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
  width: "420px",
  padding: "2rem",
});

const Container = styled(Grid)({
  height: "100vh",
});

const Background = styled(Grid)({
  width: "100%",
  height: "100vh",
});

const Highlight = styled("span")({
  color: "#2d9966",
});

export default JoinGame;
