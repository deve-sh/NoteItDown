import { Redirect, Route } from "react-router-dom";
import useStore from "hooks/useStore";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const user = useStore((state) => state.user);

	return (
		<Route
			{...rest}
			render={(props) =>
				user ? <Component {...props} /> : <Redirect to="/" />
			}
		/>
	);
};

export default ProtectedRoute;
