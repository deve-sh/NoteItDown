import { useEffect } from "react";
import Loadable from "react-loadable";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import {
	ChakraProvider,
	useDisclosure as useToggleableModal,
} from "@chakra-ui/react";

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
import LoginModal from "components/LoginModal";

// Pages
const lazyLoadPageGenerator = (importedPath) =>
	Loadable({
		loader: () => importedPath,
		loading: () => <FullPageLoader />,
	});

const HomePage = lazyLoadPageGenerator(import("pages"));
const WorkSpaces = lazyLoadPageGenerator(import("pages/WorkSpaces"));
const UserProfile = lazyLoadPageGenerator(import("pages/Profile"));
const Login = lazyLoadPageGenerator(import("pages/Login"));
const WorkspacePage = lazyLoadPageGenerator(import("pages/WorkspacePage"));
const EditorPage = lazyLoadPageGenerator(import("pages/EditorPage"));
const RecentDocuments = lazyLoadPageGenerator(import("pages/RecentDocuments"));

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
	} = useToggleableModal();

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (!user) setUser(null);
			else {
				let userInfo = {
					displayName: user.displayName,
					phoneNumber: user.phoneNumber,
					email: user.email,
					uid: user.uid,
					id: user.uid,
					providerData: JSON.parse(JSON.stringify(user.providerData)),
					lastSignInTime: user.metadata.lastSignInTime,
					photoURL: user.photoURL,
					isAnonymous: user.isAnonymous,
				};
				setUser(userInfo);
				const userDetailsFromDB = await saveUserDetailsToDB(userInfo);
				setUser({ ...userInfo, ...userDetailsFromDB });
			}
		});

		return () => auth.onAuthStateChanged(() => null);
	}, [setUser]);

	const logoutUser = async () => {
		await auth.signOut();
		setUser(null);
	};

	return (
		<Router>
			{isLoading && <FullPageLoader type={loaderType} />}
			<ToastContainer />
			<ChakraProvider>
				<GlobalStyles darkMode={isDarkModeActive} />
				{!stateUser && (
					<LoginModal closeModal={closeLoginModal} isOpen={showLoginModal} />
				)}
				<Header openLoginModal={openLoginModal} logoutUser={logoutUser} />
				<AppContentContainer>
					<Switch>
						<Route
							path="/"
							exact
							component={() => (
								<HomePage
									loggedIn={stateUser}
									openLoginModal={openLoginModal}
								/>
							)}
						/>
						<Route
							path="/login"
							component={(prps) => (
								<Login
									loggedIn={!!stateUser}
									openLoginModal={openLoginModal}
									{...prps}
								/>
							)}
						/>
						<ProtectedRoute path="/profile" component={UserProfile} />
						<ProtectedRoute path="/workspaces" component={WorkSpaces} />
						<ProtectedRoute
							path="/workspace/:workspaceId"
							component={WorkspacePage}
						/>
						<ProtectedRoute
							path="/editor/:mode/:assetId"
							component={EditorPage}
						/>
						<ProtectedRoute path="/documents" component={RecentDocuments} />
					</Switch>
				</AppContentContainer>
			</ChakraProvider>
		</Router>
	);
}

export default App;
