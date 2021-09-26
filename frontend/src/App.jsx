import { useEffect } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import auth from "firebase/authentication";
import useStore from "hooks/useStore";

import { saveUserDetailsToDB } from "API/auth";

import GlobalStyles from "components/GlobalStyles";
import FullPageLoader from "components/FullPageLoader";
import ProtectedRoute from "Wrappers/ProtectedRoute";
import AppContentContainer from "Wrappers/AppContentContainer";
import Header from "components/Header";

// Pages
import HomePage from "pages";
import WorkSpaces from "pages/WorkSpaces";
import Documents from "pages/Documents";
import LoginModal from "components/LoginModal";

function App() {
	const stateUser = useStore((state) => state.user);
	const setUser = useStore((store) => store.setUser);
	const isLoading = useStore((store) => store.isLoading);
	const loaderType = useStore((store) => store.loaderType);
	const isDarkModeActive = useStore((store) => store.isDarkModeActive);

	const {
		isOpen: showLoginModal,
		onOpen: openLoginModal,
		onClose: closeLoginModal,
	} = useDisclosure();

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
			<ChakraProvider>
				<GlobalStyles darkMode={isDarkModeActive} />
				{!stateUser && (
					<LoginModal closeModal={closeLoginModal} isOpen={showLoginModal} />
				)}
				<Header openLoginModal={openLoginModal} />
				<AppContentContainer>
					<Switch>
						<Route
							path="/"
							exact
							component={() => <HomePage loggedIn={stateUser} />}
						/>
						<ProtectedRoute path="/workspaces" component={WorkSpaces} />
						<ProtectedRoute
							path="/workspace/:workspaceId"
							component={() => ""}
						/>
						<ProtectedRoute path="/documents" component={Documents} />
						<ProtectedRoute path="/document/:documentId" component={() => ""} />
					</Switch>
				</AppContentContainer>
			</ChakraProvider>
		</Router>
	);
}

export default App;
