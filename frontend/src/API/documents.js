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
			id: documentRef.id,
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
		if (documentData.isChildDocument && documentData.parentDocument) {
			batch.update(
				db.collection("documents").doc(documentData.parentDocument),
				{
					childrenDocuments: firestore.FieldValue.arrayUnion(documentRef.id),
					hasChildDocuments: true,
					updatedAt: firestore.FieldValue.serverTimestamp(),
				}
			);
		}
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
			[`editors.${auth.currentUser.uid}`]: {
				lastAt: firestore.FieldValue.serverTimestamp(),
			},
		});

		return callback(null, (await documentRef.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const getRecentDocumentsFromWorkspaces = async (
	workspaces = [],
	callback
) => {
	try {
		if (!workspaces || !workspaces.length) return callback(null, []);
		return callback(
			null,
			(
				await db
					.collection("documents")
					.where("workspace", "in", workspaces)
					.orderBy("updatedAt", "desc")
					.limit(5)
					.get()
			).docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}))
		);
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const updateDocumentsOrder = async (
	documentOrderUpdates = [],
	callback
) => {
	try {
		const batch = db.batch();

		for (let update of documentOrderUpdates) {
			batch.update(db.collection("documents").doc(update.id), {
				position: update.position,
				updatedAt: firestore.FieldValue.serverTimestamp(),
			});
		}

		await batch.commit();

		return callback(null);
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};
