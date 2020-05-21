import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import JoinGame from "./pages/join-game";
import Game from "./pages/game";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    text: {
      secondary: "#2d9966",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact children={<JoinGame />} />
          <Route path="/game" children={<Game />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
