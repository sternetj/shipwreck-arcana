import * as firebase from "firebase";
import { v4 as uuid } from "uuid";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} from "unique-names-generator";
import { cards } from "./game/cards";
import { TokenColor } from "../pages/game/components/token";
import { shuffle } from "./shuffle";

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

export const generateGameName = () =>
  uniqueNamesGenerator({
    dictionaries: [[...adjectives, ...colors], animals],
    separator: "-",
    style: "lowerCase",
    length: 2,
  });

export const createGame = (
  gameId: string,
  playerName: string,
  player?: string,
  color: TokenColor = "green",
) => {
  const ref = databaseRef.child(gameId);
  const pId = player || playerId;
  const deck = shuffle(cards);
  const activeCards = {
    1: deck.shift(),
    2: deck.shift(),
    3: deck.shift(),
    4: deck.shift(),
  };

  ref.set({
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
  return new Promise((resolve) => {
    const ref = db.ref(gameId);
    ref.once("value", function (snapshot) {
      resolve(snapshot.val());
    });
  });
};

export const joinGame = (
  gameId: string,
  playerName: string,
  player?: string,
) => {
  return new Promise<{ name: string; ref: firebase.database.Reference }>(
    (resolve, reject) => {
      const ref = db.ref(`${gameId}/players`);
      ref.once("value", function (snapshot) {
        const currentColors = Object.values(snapshot.val()).map(
          (v: any) => v.color,
        );
        const newColor = opponentColors.find(
          (c) => currentColors.indexOf(c) === -1,
        );
        if (!newColor) {
          return reject("Game is full");
        }

        ref.update({
          [player || playerId]: {
            playerName,
            fates: [],
            color: newColor,
            tokens: defaultTokens,
          },
        });

        resolve({
          name: gameId,
          ref,
        });
      });
    },
  );
};

export const getGame = (gameId: string) => {
  console.log("fetch game " + gameId);

  return db.ref(gameId);
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
