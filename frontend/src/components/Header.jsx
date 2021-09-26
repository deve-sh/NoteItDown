import { Link } from "react-router-dom";
import {
	Box,
	Stack,
	Image,
	Button,
	IconButton,
	ButtonGroup,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
	MdAccountCircle as LoginIcon,
	MdList as ListIcon,
} from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa";
import useStore from "hooks/useStore";

const AppHeader = styled(Box)`
	position: fixed;
	border-bottom: 0.075rem solid var(--backgroundgrey);
	padding: var(--mini-spacing);
`;

const Logo = styled(Image)`
	width: 32px;
	height: 32px;
`;

const Container = styled(Stack)`
	max-width: 1100px;
	margin: 0 auto;
`;

const Left = styled.div`
	width: 35%;
`;

const Right = styled(Left)`
	width: 65%;
	text-align: right;
`;

const Header = () => {
	const stateUser = useStore((state) => state.user);
	const isDarkModeActive = useStore((store) => store.isDarkModeActive);
    const toggleDarkMode = useStore((store) => store.toggleDarkMode);

	return (
		<AppHeader w="100%">
			<Container direction="row">
				<Left>
					<Logo src="/logo.png" alt="Note It Down Logo" />
				</Left>
				<Right>
					<ButtonGroup spacing="3">
						<IconButton
							colorScheme={isDarkModeActive ? "yellow" : "teal"}
							variant="ghost"
                            onClick={toggleDarkMode}
						>
							{isDarkModeActive ? <FaSun /> : <FaMoon />}
						</IconButton>
						{!stateUser ? (
							<Button
								colorScheme="teal"
								variant="outline"
								leftIcon={<LoginIcon />}
							>
								Login
							</Button>
						) : (
							<Link to="/workspaces">
								<Button
									colorScheme="teal"
									variant="outline"
									leftIcon={<ListIcon />}
								>
									Workspaces
								</Button>
							</Link>
						)}
					</ButtonGroup>
				</Right>
			</Container>
		</AppHeader>
	);
};

export default Header;
