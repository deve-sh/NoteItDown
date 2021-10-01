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
