import { Redirect, Route } from "react-router-dom";
import useStore from "hooks/useStore";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const user = useStore((state) => state.user);

	let pathToRedirectTo = rest?.computedMatch?.url ?? "/";
	const queryParams = rest?.location?.search ?? "";

	if (queryParams && queryParams.startsWith("?"))
		pathToRedirectTo += encodeURIComponent(queryParams);

	return (
		<Route
			{...rest}
			render={(props) =>
				user ? (
					<Component {...props} />
				) : (
					<Redirect to={`/login?redirect=${pathToRedirectTo}`} />
				)
			}
		/>
	);
};

export default ProtectedRoute;
