import * as firebase from "firebase";
import { v4 as uuid } from "uuid";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  names,
} from "unique-names-generator";

const playerId = window.localStorage.getItem("playerId") || uuid();
window.localStorage.setItem("playerId", playerId);

const config = {
  apiKey: "foo",
  authDomain: "foo",
  databaseURL: "foo",
  projectId: "foo",
  storageBucket: "foo",
  messagingSenderId: "foo",
  appId: "foo",
  measurementId: "foo",
};

firebase.initializeApp(config);
const db = firebase.database();
const databaseRef = db.ref();

const uniqueName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, [...names, ...animals]],
    separator: "-",
    style: "lowerCase",
    length: 2,
  });

export const updateGame = (
  id = "games/1",
  val = {
    test: "value",
  },
) => {
  const ref = databaseRef.child(id);
  ref.set(val);
};

export const createGame = (playerName: string) => {
  const name = uniqueName();
  const ref = databaseRef.child(name);
  ref.set({
    started: false,
    creator: playerId,
    players: {
      [playerId]: playerName,
    },
  });

  return {
    name,
    ref,
  };
};

export const gameExists = async (gameId: string) => {
  return new Promise(resolve => {
    const ref = db.ref(gameId);
    ref.once("value", function(snapshot) {
      resolve(snapshot.exists());
    });
  });
};

export const joinGame = (gameId: string, playerName: string) => {
  const ref = db.ref(`${gameId}/players`);
  ref.update({
    [playerId]: playerName,
  });

  return {
    name: gameId,
    ref,
  };
};

export const getGame = (gameId: string) => {
  console.log("fetch game " + gameId);

  return db.ref(gameId);
};
