import auth from "firebase/authentication";
import store from "store";
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
	options = { email: "", userId: "", isAdmin: false },
	callback
) => {
	try {
		const userId = auth.currentUser?.uid;
		if (
			(!options?.email && !options?.userId) ||
			userId === options?.userId ||
			userId === options?.email
		)
			return;

		const user = (
			await db.collection("users").where("email", "==", options.email).get()
		).docs[0]?.data?.();

		if (!user) return callback("User not found.");
		options.userId = user.uid;

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
		return callback(null, (await workspaceRef.get()).data(), user);
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const removeUserFromWorkspace = async (
	workspaceId,
	userToRemove = "",
	callback
) => {
	try {
		const userId = auth.currentUser?.uid;
		if (!userToRemove || userId === userToRemove) return;

		const batch = db.batch();
		const workspaceRef = db.collection("workspaces").doc(workspaceId);
		const userRef = db.collection("users").doc(userToRemove);

		const workspace = (await workspaceRef.get()).data();
		if (workspace?.createdBy === userToRemove)
			return callback("Cannot remove creator from workspace.");
		if (!workspace.users?.includes(userToRemove))
			return callback("User not part of workspace.");
		const workspaceUpdates = {
			users: firestore.FieldValue.arrayRemove(userToRemove),
			admins: firestore.FieldValue.arrayRemove(userToRemove),
			lastUpdatedBy: userId,
			updatedAt: serverTimestamp(),
		};
		batch.update(workspaceRef, workspaceUpdates);
		batch.update(userRef, {
			updatedAt: serverTimestamp(),
			nWorkspaces: firestore.FieldValue.increment(1),
		});
		await batch.commit();
		return callback(null, (await workspaceRef.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const removeWorkspace = async (workspaceId, callback) => {
	try {
		const batch = db.batch();
		const workspaceRef = db.collection("workspaces").doc(workspaceId);
		const workspaceData = (await workspaceRef.get()).data();

		const users = workspaceData.users || [];
		const createdBy = workspaceData.createdBy;

		batch.delete(workspaceRef);
		const workspaceDocuments = (
			await db
				.collection("documents")
				.where("workspace", "==", workspaceId)
				.get()
		).docs;
		for (const workspaceDocument of workspaceDocuments)
			batch.delete(workspaceDocument.ref);
		for (const userId of users)
			batch.update(db.collection("users").doc(userId), {
				nWorkspaces: firestore.FieldValue.increment(-1),
				updatedAt: firestore.FieldValue.serverTimestamp(),
			});
		batch.update(db.collection("users").doc(createdBy), {
			nWorkspacesCreated: firestore.FieldValue.increment(-1),
			updatedAt: firestore.FieldValue.serverTimestamp(),
		});
		await batch.commit();
		return callback(null);
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const getWorkspaceUsers = async (workspaceId, callback) => {
	try {
		const workspaceData = (
			await db.collection("workspaces").doc(workspaceId).get()
		).data();

		const userIds = workspaceData?.users || [];
		let users = [];

		const userIdIndex = userIds.indexOf(auth.currentUser.uid);
		const userIsPartOfWorkspace = userIdIndex !== -1;

		if (userIsPartOfWorkspace) userIds.splice(userIdIndex, 1);

		if (userIds.length)
			users = (
				await db.collection("users").where("uid", "in", userIds).get()
			).docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				uid: doc.id,
				isAdmin: workspaceData?.admins?.includes(doc.id),
			}));

		if (userIsPartOfWorkspace)
			users.unshift({
				...store.getState().user,
				isAdmin: workspaceData?.admins?.includes(store.getState().user.uid),
			});

		return callback(null, users);
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};
