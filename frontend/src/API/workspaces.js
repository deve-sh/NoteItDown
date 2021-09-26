import auth from "firebase/authentication";
import db from "../firebase/db";

export const getUserWorkspaces = async (
	userId = auth?.currentUser?.uid,
	callback
) => {
	try {
		if (userId) {
			return callback(
				null,
				(
					await db
						.collection("workspaces")
						.where("users", "array-contains", userId)
						.get()
				).docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			);
		} else return callback("User not signed in.");
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};
