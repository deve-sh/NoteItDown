// File to house the global database ref of firebase.

import firebase from "./index";
import "firebase/firestore";

const db = firebase.firestore();

export default db;
export const firestore = firebase.firestore;
