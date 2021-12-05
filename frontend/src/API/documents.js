import { v4 as uuid } from "uuid";
import auth from "firebase/authentication";
import db, { firestore } from "firebase/db";

export const getDocumentsFromWorkspace = async (
	workspaceId,
	level = 1,
	parentDocument = null,
	callback
) => {
	try {
		let fetchingRef = db
			.collection("documents")
			.where("workspace", "==", workspaceId)
			.where("level", "==", level);
		if (parentDocument)
			fetchingRef = fetchingRef
				.where("isChildDocument", "==", true)
				.where("parentDocument", "==", parentDocument);
		return callback(
			null,
			(await fetchingRef.orderBy("createdAt", "desc").get()).docs.map(
				(doc) => ({ id: doc.id, ...doc.data() })
			)
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

export const deleteDocument = async (documentId, callback) => {
	try {
		const documentRef = db.collection("documents").doc(documentId);
		const batch = db.batch();
		const documentData = (await documentRef.get()).data();
		if (!documentData) return callback("Document not found");

		const workspaceRef = db
			.collection("workspaces")
			.doc(documentData.workspace);

		batch.delete(documentRef);

		let nDocumentsToReduce = 1;

		// Delete all child documents too.
		if (documentData.childrenDocuments?.length) {
			for (let childDocumentId of documentData.childrenDocuments) {
				nDocumentsToReduce++;
				batch.delete(db.collection("documents").doc(childDocumentId));
			}
		}

		batch.update(workspaceRef, {
			nDocuments: firestore.FieldValue.increment(-nDocumentsToReduce),
			updatedAt: firestore.FieldValue.serverTimestamp(),
		});

		await batch.commit();

		return callback(null);
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

export const getDocumentComments = async (documentId, callback) => {
	try {
		const commentsDoc = db.collection("documentcomments").doc(documentId);
		return callback(null, (await commentsDoc.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const addDocumentComment = async (
	commentData = {
		blocks: [],
		isReply: false,
		text: "",
		mentions: [],
	},
	documentId,
	workspaceId,
	callback
) => {
	try {
		const commentsDocRef = db.collection("documentcomments").doc(documentId);
		const commentsDoc = (await commentsDocRef.get()).data();

		const commentId = uuid();
		commentData.id = commentId;
		commentData.commentedBy = auth.currentUser.uid;
		commentData.workspace = workspaceId;
		commentData.updatedAt = firestore.FieldValue.serverTimestamp();
		commentData.createdAt = firestore.FieldValue.serverTimestamp();
		commentData.commenter = {
			displayName: auth.currentUser.displayName,
			email: auth.currentUser.email,
		};

		if (!commentData.isReply || !commentData.replyTo) {
			if (commentsDoc) {
				await commentsDocRef.update({
					updatedAt: firestore.FieldValue.serverTimestamp(),
					[`comments.${commentId}`]: commentData,
				});
			} else {
				await commentsDocRef.set({
					updatedAt: firestore.FieldValue.serverTimestamp(),
					createdAt: firestore.FieldValue.serverTimestamp(),
					workspace: workspaceId,
					document: documentId,
					comments: {
						[commentId]: commentData,
					},
				});
			}
		} else {
			if (commentsDoc) {
				await commentsDocRef.update({
					updatedAt: firestore.FieldValue.serverTimestamp(),
					[`comments.${commentData.replyTo}.replies`]: commentData,
				});
			} else return callback("Comments not found.");
		}
		return callback(null, (await commentsDoc.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};

export const deleteDocumentComment = async (
	commentId,
	documentId,
	isReply = false,
	replyTo = null,
	callback
) => {
	try {
		const commentsDocRef = db.collection("documentcomments").doc(documentId);
		const commentsDoc = (await commentsDocRef.get()).data();

		if (!isReply || !replyTo) {
			if (commentsDoc) {
				await commentsDocRef.update({
					updatedAt: firestore.FieldValue.serverTimestamp(),
					[`comments.${commentId}`]: firestore.FieldValue.delete(),
				});
			}
			return callback("Comments not found.");
		} else {
			if (commentsDoc) {
				await commentsDocRef.update({
					updatedAt: firestore.FieldValue.serverTimestamp(),
					[`comments.${replyTo}.replies`]: firestore.FieldValue.delete(),
				});
			} else return callback("Comments not found.");
		}
		return callback(null, (await commentsDoc.get()).data());
	} catch (err) {
		console.log(err);
		return callback(err.message);
	}
};
