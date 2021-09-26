import firebase from "firebase/app";
import env from "../.env";

const firebasePrimaryApp = !firebase.apps.length
	? firebase.initializeApp(env.firebaseConfig)
	: firebase.apps[0];

export default firebasePrimaryApp;
