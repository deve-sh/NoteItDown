import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Avatar, Heading, Text, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GiBookshelf } from "react-icons/gi";

import useStore from "hooks/useStore";

const UserProfileContainer = styled.div`
	margin: 0 auto;
	padding: calc(2 * var(--standard-spacing)) var(--standard-spacing);
	max-width: 1100px;
	min-height: 85vh;
	display: flex;
	flex-flow: column;
	text-align: center;
	justify-content: center;
	align-items: center;
`;

const UserProfile = () => {
	const user = useStore((store) => store.user);

	const providerIcon = {
		"google.com": <FcGoogle size="1.25rem" />,
		"github.com": <FaGithub size="1.25rem" />,
	};

	return (
		<UserProfileContainer>
			<Helmet>
				<title>Note It Down - Profile</title>
			</Helmet>
			<Avatar src={user?.photoURL} size="2xl" name={user?.displayName} />
			<Heading size="lg" as="h3" marginTop="10px">
				{user?.displayName || "Unnamed"}
			</Heading>
			<Text marginTop="10px" display="flex" alignItems="center">
				{providerIcon[user?.providerData?.[0]?.providerId]}&nbsp;{user?.email}
			</Text>
			<Text margin="10px auto" color="gray">
				Workspaces: {user?.nWorkspaces || 0}
			</Text>
			<Link to="/workspaces">
				<Button
					colorScheme="teal"
					variant="solid"
					leftIcon={<GiBookshelf size="1.25rem" />}
				>
					View Your Workspaces
				</Button>
			</Link>
		</UserProfileContainer>
	);
};

export default UserProfile;
