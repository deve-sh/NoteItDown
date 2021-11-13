import create from "zustand/vanilla";
import { persist } from "zustand/middleware";

const store = create(
	persist(
		(set) => ({
			// User Auth
			user: null,
			setUser: (user = null) => set((state) => ({ ...state, user })),
			// Loader
			isLoading: false,
			loaderType: "loader",
			setLoading: (isLoading = false, loaderType = "loader") =>
				set((state) => ({ ...state, isLoading, loaderType })),
			// Dark Mode
			isDarkModeActive: false,
			toggleDarkMode: () =>
				set((state) => ({
					...state,
					isDarkModeActive: !state.isDarkModeActive,
				})),
			// Workspace User List
			userList: [],
			setUserList: (usersToUpdate = []) =>
				set((state) => {
					let updatedUserList = [...(state.userList || [])];
					for (let user of usersToUpdate) {
						const userIndexInStore = updatedUserList.findIndex(
							(userInState) =>
								(userInState.id || userInState.uid) === (user.uid || user.id)
						);
						if (userIndexInStore === -1)
							updatedUserList.push({
								...user,
								createdAt:
									user.createdAt?.toDate?.()?.toISOString?.() ||
									new Date(user.createdAt) ||
									new Date(),
								updatedAt:
									user.updatedAt?.toDate?.()?.toISOString?.() ||
									new Date(user.updatedAt) ||
									new Date(),
							});
						else
							updatedUserList[userIndexInStore] = {
								...user,
								createdAt:
									user.createdAt?.toDate?.()?.toISOString?.() ||
									new Date(user.createdAt) ||
									new Date(),
								updatedAt:
									user.updatedAt?.toDate?.()?.toISOString?.() ||
									new Date(user.updatedAt) ||
									new Date(),
							};
					}
					return { ...state, userList: updatedUserList };
				}),
		}),
		{
			name: "noteitdown-storage",
		}
	)
);

export default store;
