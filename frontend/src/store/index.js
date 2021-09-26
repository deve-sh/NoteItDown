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
		}),
		{
			name: "hiqr-storage",
		}
	)
);

export default store;
