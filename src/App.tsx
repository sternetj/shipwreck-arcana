import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import "./App.css";
import JoinGame from "./pages/join-game";
import Game from "./pages/game";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import ReactGA from "react-ga";

const theme = createTheme({
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

const PageView = ({ Component }: { Component: React.ReactNode }) => {
  const l = useLocation();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [l.pathname]);

  return <>{Component}</>;
};

const router = createBrowserRouter([
  {
    path: "/join",
    element: <PageView Component={<JoinGame />} />,
  },
  {
    path: "/game",
    element: <PageView Component={<Game />} />,
  },
  {
    path: "/",
    element: <PageView Component={<JoinGame />} />,
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
};

export default App;
