import auth from "firebase/authentication";

export const userHasAccessToWorkspace = (workspace) => {
	return (
		workspace?.users?.includes?.(auth.currentUser?.uid) ||
		workspace?.admins?.includes?.(auth.currentUser?.uid)
	);
};

export const userHasEditAccessToWorkspace = (workspace) => {
	return workspace?.admins?.includes?.(auth.currentUser?.uid);
};
