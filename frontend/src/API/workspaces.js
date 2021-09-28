import auth from "firebase/authentication";
import db, { firestore } from "../firebase/db";

const serverTimestamp = firestore.FieldValue.serverTimestamp;

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
						.orderBy("createdAt", "desc")
						.limit(5)
						.get()
				).docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			);
		} else return callback("User not signed in.");
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const createWorkspace = async (workspaceInputs, callback) => {
	try {
		const userId = auth.currentUser?.uid;
		if (userId) {
			const userRef = db.collection("users").doc(userId);
			const nWorkspaces = (await userRef.get()).data().nWorkspacesCreated || 0;

			if (nWorkspaces >= 5)
				return callback("You can only create 5 workspaces.");

			const batch = db.batch();

			const workspaceRef = db.collection("workspaces").doc();
			batch.set(workspaceRef, {
				...workspaceInputs,
				users: [userId],
				nUsers: 1,
				admins: [userId],
				nAdmins: 1,
				createdBy: userId,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				id: workspaceRef.id,
			});
			batch.update(userRef, {
				nWorkspaces: firestore.FieldValue.increment(1),
				nWorkspacesCreated: firestore.FieldValue.increment(1),
				updatedAt: serverTimestamp(),
			});
			await batch.commit();
			return callback(null, (await workspaceRef.get()).data());
		} else return callback("User not signed in.");
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const updateWorkspace = async (
	workspaceId,
	workspaceUpdates,
	callback
) => {
	try {
		const userId = auth.currentUser?.uid;
		if (userId) {
			const batch = db.batch();
			const workspaceRef = db.collection("workspaces").doc(workspaceId);
			batch.update(workspaceRef, {
				...workspaceUpdates,
				lastUpdatedBy: userId,
				updatedAt: serverTimestamp(),
			});
			await batch.commit();
			return callback(null, (await workspaceRef.get()).data());
		} else return callback("User not signed in.");
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const addUserToWorkspace = async (
	workspaceId,
	options = { userId: "", isAdmin: false },
	callback
) => {
	try {
		const userId = auth.currentUser?.uid;
		if (!options?.userId || userId === options?.userId) return;

		const batch = db.batch();
		const workspaceRef = db.collection("workspaces").doc(workspaceId);
		const userRef = db.collection("users").doc(options.userId);

		const workspace = (await workspaceRef.get()).data();
		if (workspace.users?.includes(options.userId))
			return callback("User already part of workspace.");

		const workspaceUpdates = {
			users: firestore.FieldValue.arrayUnion(options?.userId),
			lastUpdatedBy: userId,
			updatedAt: serverTimestamp(),
		};
		if (options.isAdmin)
			workspaceUpdates.admins = firestore.FieldValue.arrayUnion(
				options?.userId
			);
		batch.update(workspaceRef, workspaceUpdates);
		batch.update(userRef, {
			updatedAt: serverTimestamp(),
			nWorkspaces: firestore.FieldValue.increment(1),
		});
		await batch.commit();
		return callback(null, (await workspaceRef.get()).data());
	} catch (err) {}
};
