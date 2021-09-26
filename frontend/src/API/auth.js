import db, { firestore } from "../firebase/db";
import auth, { providers } from "../firebase/authentication";

const serverTimestamp = firestore.FieldValue.serverTimestamp;

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
		if (!userInDB.exists) {
			const batch = db.batch();
			batch.set(userRef, {
				...userDetails,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			// Create an initial workspace.
			const workspaceRef = db.collection("workspaces").doc();
			batch.set(workspaceRef, {
				users: [userRef.id],
				nUsers: 1,
				admins: [userRef.id],
				nAdmins: 1,
				createdBy: userRef.id,
				name: "Personal Workspace",
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				id: workspaceRef.id,
			});
			await batch.commit();
		} else
			await userRef.update({
				...userDetails,
				updatedAt: serverTimestamp(),
			});

		return true;
	} catch (err) {
		if (process.env.NODE_ENV === "development") console.log(err);
		return false;
	}
}

export const loginWithGithub = async (callback) => {
	try {
		if (!auth.currentUser) {
			await auth.signInWithPopup(providers.githubProvider);
			return callback(null);
		} else return callback("User already signed in.");
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};
