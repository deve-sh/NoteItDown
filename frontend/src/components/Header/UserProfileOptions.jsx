import { Link } from "react-router-dom";
import {
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { MdAccountCircle } from "react-icons/md";
import { IoDocuments, IoLogOutSharp } from "react-icons/io5";
import { GiBookshelf } from "react-icons/gi";

const UserProfileOptions = ({ logoutUser = () => null }) => (
	<Menu>
		<MenuButton
			as={IconButton}
			aria-label="user Options"
			icon={<MdAccountCircle size="1.5rem" />}
			colorScheme="teal"
			variant="ghost"
		/>
		<MenuList>
			<Link to="/profile">
				<MenuItem icon={<MdAccountCircle />}>Profile</MenuItem>
			</Link>
			<Link to="/workspaces">
				<MenuItem icon={<GiBookshelf />}>Workspaces</MenuItem>
			</Link>
			<Link to="/documents">
				<MenuItem icon={<IoDocuments />}>Recent Documents</MenuItem>
			</Link>
			<MenuItem icon={<IoLogOutSharp />} onClick={logoutUser}>
				Logout
			</MenuItem>
		</MenuList>
	</Menu>
);

export default UserProfileOptions;
