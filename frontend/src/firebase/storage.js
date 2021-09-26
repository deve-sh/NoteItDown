// File to house the global database ref of firebase.

import firebase from "./index";
import "firebase/storage";

const storage = firebase.storage();

export default storage;
