import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import JoinGame from "./pages/join-game";
import Game from "./pages/game";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact children={<JoinGame />} />
        <Route path="/game" children={<Game />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
