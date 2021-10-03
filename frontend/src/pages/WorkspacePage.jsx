import { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import {
	HStack,
	Box,
	Heading,
	Button,
	ButtonGroup,
	IconButton,
	List,
	ListItem,
	Text,
	useDisclosure,
} from "@chakra-ui/react";

import { BiPlus } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { IoTrash } from "react-icons/io5";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";
import { getDocumentsFromWorkspace } from "API/documents";
import { getWorkspaceUsers, removeWorkspace } from "API/workspaces";

import toasts from "helpers/toasts";

import ContentWrapper from "Wrappers/ContentWrapper";
import NoneFound from "components/NoneFound";
import UserListModal from "components/Workspaces/UserListModal";

const WorkspacePage = (props) => {
	const history = useHistory();

	const user = useStore((state) => state.user);
	const setLoading = useStore((store) => store.setLoading);

	const workspaceId = props?.match?.params?.workspaceId;

	const {
		data: workspaceData,
		error,
		isLoading,
	} = useFirestore(workspaceId ? `workspaces/${workspaceId}` : null);

	useEffect(() => {
		setLoading(isLoading);
	}, [setLoading, isLoading]);

	const [workspaceDocuments, setWorkspaceDocuments] = useState([]);

	// For user list.
	const {
		isOpen: isUserListModalOpen,
		onOpen: openUserListModalUI,
		onClose: closeUserListModal,
	} = useDisclosure();
	const [userList, setUserList] = useState(null);
	const [isLoadingUserList, setLoadingUserList] = useState(false);

	useEffect(() => {
		getDocumentsFromWorkspace(workspaceId, 1, (err, documents) => {
			if (err) return toasts.generateError(err);
			setWorkspaceDocuments(documents || []);
		});
	}, [workspaceId]);

	const deleteWorkspace = () => {
		if (!window.confirm("Are you sure? This action is irreversible!")) return;
		setLoading(true);
		removeWorkspace(workspaceId, (err) => {
			setLoading(false);
			if (err) return toasts.generateError(err);
			history.push("/workspaces");
		});
	};

	const openUserListModal = async () => {
		openUserListModalUI();
		if (!userList) {
			// Fetch user list
			setLoadingUserList(true);
			getWorkspaceUsers(workspaceId, (err, users) => {
				setLoadingUserList(false);
				if (err) return toasts.generateError(err);
				setUserList(users);
			});
		}
	};

	if (!isLoading && (error || !workspaceData)) return <Redirect to="/" />;
	return (
		<ContentWrapper>
			<HStack alignItems="center">
				<Box width="50%" as={HStack} display="flex" alignItems="flex-end">
					<Heading as="h4" size="lg">
						{workspaceData?.identifierEmoji?.emoji}
						{workspaceData?.name}
					</Heading>
					<Text color="gray" fontSize="sm">
						{workspaceData?.users?.length || 1} User
						{workspaceData?.users?.length > 1 ? "(s)" : ""}
					</Text>
				</Box>
				<Box width="50%" textAlign="right">
					{workspaceData?.admins?.includes(user?.uid) && (
						<ButtonGroup spacing="3">
							<Button
								colorScheme="teal"
								variant="solid"
								leftIcon={<FiUsers size="1.25rem" />}
								onClick={openUserListModal}
							>
								Users
							</Button>
							<IconButton
								variant="ghost"
								colorScheme="red"
								onClick={deleteWorkspace}
							>
								<IoTrash />
							</IconButton>
						</ButtonGroup>
					)}
				</Box>
			</HStack>
			{workspaceDocuments?.length ? (
				<List spacing="3">
					{workspaceDocuments.map((doc) => (
						<ListItem key={doc.id}>
							<Link to={`editor/document/${doc.id}`}>
								{doc.identifierEmoji?.emoji || "📄"} {doc.title}
							</Link>
						</ListItem>
					))}
				</List>
			) : (
				<NoneFound label="No Documents Added So far.">
					<Link to={`/editor/new/${workspaceId}`}>
						<Button
							colorScheme="blue"
							variant="solid"
							leftIcon={<BiPlus size="1.25rem" />}
						>
							Add New Document
						</Button>
					</Link>
				</NoneFound>
			)}
			<UserListModal
				isOpen={isUserListModalOpen}
				onClose={closeUserListModal}
				userList={userList}
			/>
		</ContentWrapper>
	);
};

export default WorkspacePage;
