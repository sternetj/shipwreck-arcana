import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Route path="/" exact children={JoinGame} />
        <Route path="/game" exact children={Game} />
      </BrowserRouter>
    </div>
  );
};

export default App;
