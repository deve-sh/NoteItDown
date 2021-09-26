import { useEffect } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import auth from "firebase/authentication";
import useStore from "hooks/useStore";

import { saveUserDetailsToDB } from "API/auth";

import GlobalStyles from "components/GlobalStyles";
import FullPageLoader from "components/FullPageLoader";
// import ProtectedRoute from "Wrappers/ProtectedRoute";
import Header from "components/Header";

// Pages
import HomePage from "pages";

function App() {
	const stateUser = useStore((state) => state.user);
	const setUser = useStore((store) => store.setUser);
	const isLoading = useStore((store) => store.isLoading);
	const loaderType = useStore((store) => store.loaderType);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (!user) setUser(null);
			else {
				let userInfo = {
					displayName: user.displayName,
					phoneNumber: user.phoneNumber,
					email: user.email,
					uid: user.uid,
					id: user.uid,
					providerData: user.providerData,
					lastSignInTime: user.metadata.lastSignInTime,
					photoURL: user.photoURL,
					isAnonymous: user.isAnonymous,
				};
				setUser(userInfo);
				saveUserDetailsToDB(userInfo);
			}
		});

		return () => auth.onAuthStateChanged(() => null);
	}, [setUser]);

	return (
		<Router>
			{isLoading && <FullPageLoader type={loaderType} />}
			<ToastContainer />
			<GlobalStyles />
			<ChakraProvider>
				<Header />
				<Switch>
					<Route
						path="/"
						exact
						component={() => <HomePage loggedIn={stateUser} />}
					/>
				</Switch>
			</ChakraProvider>
		</Router>
	);
}

export default App;
