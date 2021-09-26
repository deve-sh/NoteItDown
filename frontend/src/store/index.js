import create from "zustand/vanilla";
import { persist } from "zustand/middleware";

const store = create(
	persist(
		(set) => ({
			user: null,
			setUser: (user = null) => set((state) => ({ ...state, user })),
			isLoading: false,
			loaderType: "loader",
			setLoading: (isLoading = false, loaderType = "loader") =>
				set((state) => ({ ...state, isLoading, loaderType })),
		}),
		{
			name: "hiqr-storage",
		}
	)
);

export default store;
