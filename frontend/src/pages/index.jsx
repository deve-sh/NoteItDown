// Homepage

import {
	Container,
	Heading,
	Text,
	Image,
	ButtonGroup,
	Button,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
	MdAccountCircle as LoginIcon,
	MdList as ListIcon,
} from "react-icons/md";
import { FaGithub as GithubIcon } from "react-icons/fa";

const HomePageSection = styled(Container)`
	margin: 0 auto;
	padding: calc(2 * var(--standard-spacing)) var(--standard-spacing);
	max-width: 1100px;
	min-height: 95vh;
`;

const HeroSection = styled(HomePageSection)`
	min-height: 95vh;
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
`;

const Homepage = ({ loggedIn = false }) => (
	<HeroSection maxW="container.sm" centerContent>
		<Image
			style={{ maxHeight: "30vh" }}
			objectFit="cover"
			src="/homepage/heroimage.png"
			alt="Team Note-Taking Workspace"
		/>
		<Heading as="h1" marginBottom="10px" marginTop="25px">
			Note Taking Workspace!
		</Heading>
		<Text size="lg" color="gray" marginBottom="10px">
			For You And Your Team
		</Text>
		<ButtonGroup variant="outline" spacing="4" marginTop="15px">
			{!loggedIn ? (
				<Button
					colorScheme="teal"
					variant="solid"
					leftIcon={<LoginIcon size="1.25rem" />}
				>
					Login
				</Button>
			) : (
				<Button
					colorScheme="teal"
					variant="solid"
					leftIcon={<ListIcon size="1.25rem" />}
				>
					View Your Workspaces
				</Button>
			)}
			<Button leftIcon={<GithubIcon size="1.25rem" />}>View On GitHub</Button>
		</ButtonGroup>
	</HeroSection>
);

export default Homepage;