// Homepage
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
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

const Homepage = ({ loggedIn = false, openLoginModal = () => null }) => (
	<HeroSection maxW="container.sm" centerContent>
		<Helmet>
			<title>Note It Down</title>
		</Helmet>
		<Image
			style={{ maxHeight: "45vh" }}
			objectFit="cover"
			src="/homepage/heroimage.svg"
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
					onClick={openLoginModal}
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
			<a
				href={"https://github.com/deve-sh/NoteItDown"}
				target="_blank"
				rel="noopener noreferrer"
				title="View On GitHub"
			>
				<Button leftIcon={<GithubIcon size="1.25rem" />}>View On GitHub</Button>
			</a>
		</ButtonGroup>
	</HeroSection>
);

export default Homepage;
