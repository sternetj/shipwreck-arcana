import * as firebase from "firebase";
import { v4 as uuid } from "uuid";
import { helpers } from "faker";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  names,
} from "unique-names-generator";
import { cards } from "./game/cards";

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

export function updateScore(
  id: string,
  points: { doom: number; points: number },
) {
  const ref = getGame(id);
  ref.update(points);
}

export function fadeCard(id: string, points: { doom: number; points: number }) {
  const ref = getGame(id);
  ref.update(points);
}

export const createGame = (playerName: string) => {
  const name = uniqueName();
  const ref = databaseRef.child(name);
  const deck = helpers.shuffle(cards);
  const activeCards = {
    1: deck.shift(),
    2: deck.shift(),
    3: deck.shift(),
    4: deck.shift(),
  };

  ref.set({
    started: false,
    creator: playerId,
    powers: [],
    deck,
    discard: [],
    cards: activeCards,
    players: {
      [playerId]: playerName,
    },
    fates: helpers.shuffle(fates),
    doom: 0,
    points: 0,
  });

  return {
    name,
    ref,
  };
};

export const gameExists = async (gameId: string) => {
  return new Promise((resolve) => {
    const ref = db.ref(gameId);
    ref.once("value", function (snapshot) {
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

const fates = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7];
