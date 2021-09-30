import db from "firebase/db";

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
