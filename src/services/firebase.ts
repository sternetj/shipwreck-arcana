import * as firebase from "firebase/app";
import * as firebaseDb from "firebase/database";
import { v4 as uuid } from "uuid";
import { cards } from "./game/cards";
import { TokenColor } from "../pages/game/components/token";
import { shuffle } from "./shuffle";
import { sample } from "lodash";

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

const app = firebase.initializeApp(config);
const db = firebaseDb.getDatabase(app);
const databaseRef = firebaseDb.ref(db);

export const generateGameName = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const s = sample;

  return `${s(chars)}${s(chars)}${s(chars)}${s(chars)}`;
};

export const createGame = (
  gameId: string,
  playerName: string,
  player?: string,
  color: TokenColor = "green",
) => {
  const ref = firebaseDb.child(databaseRef, gameId);
  const pId = player || playerId;
  const deck = shuffle(cards);
  const activeCards = {
    1: deck.shift(),
    2: deck.shift(),
    3: deck.shift(),
    4: deck.shift(),
  };

  firebaseDb.set(ref, {
    powers: [],
    deck,
    discard: [],
    cards: activeCards,
    activePlayer: pId,
    players: {
      [pId]: {
        playerName,
        color,
        fates: [],
        tokens: defaultTokens,
      },
    },
    fates: shuffle(fates),
    doom: 0,
    points: 0,
  });

  return {
    name: gameId,
    ref,
  };
};

export const gameExists = async (gameId: string) => {
  const ref = firebaseDb.child(databaseRef, gameId);
  const snapshot = await firebaseDb.get(ref);
  return snapshot.val();
};

export const joinGame = async (
  gameId: string,
  playerName: string,
  player?: string,
) => {
  const ref = firebaseDb.child(databaseRef, `${gameId}/players`);
  const snapshot = await firebaseDb.get(ref);
  console.log(snapshot);
  const currentColors = Object.values(snapshot.val()).map((v: any) => v.color);
  const newColor = opponentColors.find((c) => currentColors.indexOf(c) === -1);
  if (!newColor) {
    throw new Error("Game is full");
  }

  await firebaseDb.update(ref, {
    [player || playerId]: {
      playerName,
      fates: [],
      color: newColor,
      tokens: defaultTokens,
    },
  });

  return {
    name: gameId,
    ref,
  };
};

export const getGame = (gameId: string) => {
  console.log("fetch game " + gameId);

  return firebaseDb.ref(db, gameId);
};

const fates = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7];
export const opponentColors: TokenColor[] = [
  "green",
  "red",
  "blue",
  "gray",
  "yellow",
];
const defaultTokens = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
};

export { fates, defaultTokens };
