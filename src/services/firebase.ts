import * as firebase from "firebase";

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

export const updateGame = (
  id = "games/1",
  val = {
    test: "value",
  },
) => {
  db.ref(id).set(val);
};

export const gameRef = databaseRef.child("games/1");
