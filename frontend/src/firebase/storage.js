// File to house the global storage ref of firebase.

import firebase from "./index";
import "firebase/storage";

const storage = firebase.storage();

export default storage;
