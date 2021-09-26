import { useEffect } from "react";
import { Redirect } from "react-router-dom";

const Login = (props) => {
	const redirectTo = props?.history?.location?.search ?? "/";

	useEffect(() => {
		if (!props.loggedIn) props.openLoginModal();
	}, [props]);

	return props.loggedIn ? (
		<Redirect to={decodeURIComponent(redirectTo.split("=").pop())} />
	) : (
		""
	);
};

export default Login;
