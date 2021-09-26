// Homepage
import { Link } from "react-router-dom";
import {
	Container,
	Heading,
	Text,
	Image,
	ButtonGroup,
	Button,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { MdAccountCircle as LoginIcon } from "react-icons/md";
import { FaGithub as GithubIcon } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";

const HomePageSection = styled(Container)`
	margin: 0 auto;
	padding: calc(2 * var(--standard-spacing)) var(--standard-spacing);
	max-width: 1100px;
	min-height: 85vh;
`;

const HeroSection = styled(HomePageSection)`
	min-height: 85vh;
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
		<Text fontSize="lg" color="gray" marginBottom="10px">
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
				<Link to="/workspaces">
					<Button
						colorScheme="teal"
						variant="solid"
						leftIcon={<GiBookshelf size="1.25rem" />}
					>
						View Your Workspaces
					</Button>
				</Link>
			)}
			<Button leftIcon={<GithubIcon size="1.25rem" />}>View On GitHub</Button>
		</ButtonGroup>
	</HeroSection>
);

export default Homepage;
