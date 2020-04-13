import React, { useState } from "react";
import qs from "qs";
import { useObjectVal } from "react-firebase-hooks/database";
import { useLocation } from "react-router-dom";
import { getGame } from "../../services/firebase";
import { cards } from "../../services/game";
import { styled, Grid } from "@material-ui/core";
import { Card } from "./components/Card";
import { Hours } from "./components/Hours";
import { Fate } from "./components/Fate";
import Draggable, { DraggableData } from "react-draggable";

const Game = () => {
  const { search } = useLocation();
  const { name } = qs.parse(search, { ignoreQueryPrefix: true });
  const [snapshot] = useObjectVal(getGame(name || ""));

  console.log(JSON.stringify(snapshot, null, 2));
  return (
    <Grid container direction="column">
      <Grid item>Info</Grid>
      <Grid container item direction="row" wrap="nowrap">
        <Card card={cards[1]} />
        <Hours doom={0} points={2} />
        <Card card={cards[2]} dropTarget />
        <Card card={cards[3]} dropTarget />
        <Card card={cards[4]} dropTarget />
        <Card card={cards[5]} dropTarget />
      </Grid>
      <Grid container item alignItems="center">
        {fates.map((f) => (
          <Draggable position={{ x: 0, y: 0 }}>
            <div>
              <Fate key={f} num={f as any} />
            </div>
          </Draggable>
        ))}
      </Grid>
    </Grid>
  );
};

const fates = new Array(7).fill(1).map((_, i) => i + 1);

export default Game;
