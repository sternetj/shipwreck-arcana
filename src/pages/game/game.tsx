import React from "react";
import qs from "qs";
import { useObjectVal } from "react-firebase-hooks/database";
import { useLocation } from "react-router-dom";
import { getGame } from "../../services/firebase";
import { styled, Grid } from "@material-ui/core";

const Game = () => {
  const { search } = useLocation();
  const { name } = qs.parse(search, { ignoreQueryPrefix: true });
  const [snapshot] = useObjectVal(getGame(name || ""));

  return (
    <div>
      <h1>Game</h1>
      <pre>{JSON.stringify(snapshot, null, 2)}</pre>
    </div>
  );
};

export default Game;
