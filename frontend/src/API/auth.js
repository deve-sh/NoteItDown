import db, { firestore } from "../firebase/db";
import auth, { providers } from "../firebase/authentication";

export const loginWithGoogle = async (callback) => {
	try {
		if (!auth.currentUser) {
			await auth.signInWithPopup(providers.googleProvider);
			return callback(null);
		} else return callback("User already signed in.");
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export async function saveUserDetailsToDB(userDetails) {
	// Supposed to run in the background
	try {
		const userRef = db.collection("users").doc(userDetails.uid);
		const userInDB = await userRef.get();
		if (!userInDB.exists)
			await userRef.set({
				...userDetails,
				createdAt: firestore.FieldValue.serverTimestamp(),
				updatedAt: firestore.FieldValue.serverTimestamp(),
			});
		else
			await userRef.update({
				...userDetails,
				updatedAt: firestore.FieldValue.serverTimestamp(),
			});

		return true;
	} catch (err) {
		if (process.env.NODE_ENV === "development") console.log(err);
		return false;
	}
}
