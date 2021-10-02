import auth from "firebase/authentication";
import db, { firestore } from "firebase/db";

export const getDocumentsFromWorkspace = async (
	workspaceId,
	level = 1,
	callback
) => {
	try {
		return callback(
			null,
			(
				await db
					.collection("documents")
					.where("workspace", "==", workspaceId)
					.where("level", "==", level)
					.orderBy("createdAt", "desc")
					.get()
			).docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		);
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const addDocumentToWorkspace = async (
	workspaceId,
	documentData = {},
	callback
) => {
	try {
		const documentRef = db.collection("documents").doc();
		const workspaceRef = db.collection("workspaces").doc(workspaceId);
		const batch = db.batch();
		batch.set(documentRef, {
			...documentData,
			workspace: workspaceId,
			createdAt: firestore.FieldValue.serverTimestamp(),
			updatedAt: firestore.FieldValue.serverTimestamp(),
			lastUpdatedBy: auth.currentUser.uid,
			createdBy: auth.currentUser.uid,
			editors: {
				[auth.currentUser.uid]: {
					lastAt: firestore.FieldValue.serverTimestamp(),
				},
			},
		});
		batch.update(workspaceRef, {
			nDocuments: firestore.FieldValue.increment(1),
			updatedAt: firestore.FieldValue.serverTimestamp(),
		});
		await batch.commit();
		return callback(null, (await documentRef.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const updateDocument = async (
	documentId,
	documentUpdates = {},
	callback
) => {
	try {
		delete documentUpdates.workspace;
		delete documentUpdates.createdBy;
		delete documentUpdates.createdAt;

		const documentRef = db.collection("documents").doc(documentId);
		await documentRef.update({
			...documentUpdates,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			lastUpdatedBy: auth.currentUser.uid,
		});

		return callback(null, (await documentRef.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};
