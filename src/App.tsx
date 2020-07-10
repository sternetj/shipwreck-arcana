import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import JoinGame from "./pages/join-game";
import Game from "./pages/game";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import ReactGA from "react-ga";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#2d9966",
    },
    text: {
      secondary: "#2d9966",
    },
  },
});

ReactGA.initialize("UA-44282114-3");

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const Routes = () => {
  const l = useLocation();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [l.pathname]);

  return (
    <Switch>
      <Route path="/join" exact children={<JoinGame />} />
      <Route path="/" exact children={<JoinGame />} />
      <Route path="/game" children={<Game />} />
    </Switch>
  );
};

export default App;
