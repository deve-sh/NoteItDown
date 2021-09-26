// File to house the global authentication ref of firebase.

import firebase from "./index";
import mainFirebase from "firebase/app";
import "firebase/auth";

const auth = firebase.auth();

// Providers
let googleProvider = new mainFirebase.auth.GoogleAuthProvider();

export default auth;
export const providers = { googleProvider, mainFirebase };

const getToken = async (refreshToken = true) => {
	if (auth.currentUser) {
		let token = await auth.currentUser.getIdToken(refreshToken);
		localStorage.setItem("noteitdown-usertoken", token);
		return token;
	} else return localStorage.getItem("noteitdown-usertoken") || "";
};

export { getToken };
