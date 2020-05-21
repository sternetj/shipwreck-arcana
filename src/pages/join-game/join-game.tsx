import React, { useState, FC, useEffect, useRef } from "react";
import { Grid, styled, Card, Typography, FilledInput } from "@material-ui/core";
import FilterNone from "@material-ui/icons/FilterNone";
import Welcome from "./welcome";
import SwipeableViews from "react-swipeable-views";
import {
  createGame,
  joinGame,
  gameExists,
  generateGameName,
} from "../../services/firebase";
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
  const { player, name } = qs.parse(search, { ignoreQueryPrefix: true });
  const router = useHistory();
  const [slide, setSlide] = useState(0);
  const [type, setType] = useState<ConnectType>();
  const [directLink, setDirectLink] = useState<boolean>();
  const [gameId, setGameId] = useState(name || "");
  const [errorText, setErrorText] = useState("");
  const copyInput = useRef<HTMLInputElement>();

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
    try {
      const game: any = isCreate(type)
        ? createGame(gameId, name, player)
        : await joinGame(gameId, name, player);

      router.push(
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
              onSubmit={onSubmit}>
              {isCreate(type) && (
                <Grid container justify="center" style={{ padding: "1rem 0" }}>
                  <Typography variant="caption">
                    Click this join link to copy it to your clipboard
                  </Typography>
                  <Input
                    value={`${window.location.origin}?name=${gameId}`}
                    readOnly
                    fullWidth
                    inputRef={copyInput}
                    onClick={() => {
                      copyInput.current?.select();
                      document.execCommand("copy");
                      copyInput.current?.setSelectionRange(0, 0);
                    }}
                    endAdornment={<FilterNone />}
                  />
                </Grid>
              )}
            </EnterName>
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
  width: "390px",
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

const Input = styled(FilledInput)({
  "&&& *": {
    cursor: "pointer",
  },
});

export default JoinGame;
