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
  apiKey: "AIzaSyDpINexaL-kfVLiDhG_-LBByAuPVqD_D_s",
  authDomain: "shipwreck-arcana.firebaseapp.com",
  databaseURL: "https://shipwreck-arcana.firebaseio.com",
  projectId: "shipwreck-arcana",
  storageBucket: "shipwreck-arcana.appspot.com",
  messagingSenderId: "70572885034",
  appId: "1:70572885034:web:8603a3f2908181fb6f6f53",
  measurementId: "G-G7PRZH5RB8",
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
