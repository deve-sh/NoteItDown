import { useEffect, useRef, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ReactSortable } from "react-sortablejs";

import styled from "@emotion/styled";
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
	Container,
} from "@chakra-ui/react";

import { BiPlus } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { IoTrash } from "react-icons/io5";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";
import {
	getDocumentsFromWorkspace,
	updateDocumentsOrder as updateDocumentsOrderInDatabase,
} from "API/documents";
import {
	addUserToWorkspace,
	getWorkspaceUsers,
	removeUserFromWorkspace,
	removeWorkspace,
} from "API/workspaces";

import toasts from "helpers/toasts";

import ContentWrapper from "Wrappers/ContentWrapper";
import NoneFound from "components/NoneFound";
import UserListModal from "components/Workspaces/UserListModal";

const WorkspaceContentWrapper = styled(ContentWrapper)`
	max-width: 850px;
`;

const DocumentLink = styled(Link)`
	padding: calc(0.5 * var(--standard-spacing));
	width: 100%;
	display: block;
	&:hover {
		background: var(--backgroundgrey);
	}
`;

const WorkspacePage = (props) => {
	const history = useHistory();

	const user = useStore((state) => state.user);
	const setLoading = useStore((store) => store.setLoading);

	const workspaceId = props?.match?.params?.workspaceId;

	const {
		data: workspaceData,
		error,
		isLoading,
		mutate: setWorkspaceData,
	} = useFirestore(workspaceId ? `workspaces/${workspaceId}` : null);

	useEffect(() => {
		setLoading(isLoading);
	}, [setLoading, isLoading]);

	const [workspaceDocuments, setWorkspaceDocuments] = useState([]);
	const isUpdatingDocumentOrder = useRef(false);

	// For user list.
	const {
		isOpen: isUserListModalOpen,
		onOpen: openUserListModalUI,
		onClose: closeUserListModal,
	} = useDisclosure();
	const [userList, setUserList] = useState(null);
	const [isLoadingUserList, setLoadingUserList] = useState(false);

	const updateStoreUserList = useStore((state) => state.setUserList);

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

	const openUserListModal = () => {
		openUserListModalUI();
		if (!userList) {
			// Fetch user list
			setLoadingUserList(true);
			getWorkspaceUsers(workspaceId, (err, users) => {
				setLoadingUserList(false);
				if (err) return toasts.generateError(err);
				setUserList(users);
				updateStoreUserList(users);
			});
		}
	};

	const addNewUser = (email) => {
		addUserToWorkspace(
			workspaceId,
			{ email, userId: "", isAdmin: false },
			(err, updatedWorkspaceData, addedUser) => {
				if (err) return toasts.generateError(err);
				setUserList((users) => [...users, addedUser]);
				updateStoreUserList([addedUser]);
				setWorkspaceData(updatedWorkspaceData);
				toasts.generateSuccess("Added user successfully.");
			}
		);
	};

	const removeUser = (userIdToRemove) => {
		if (
			!window.confirm(
				"Are you sure you want to remove the user from this workspace?"
			)
		)
			return;
		if (userList?.length) {
			removeUserFromWorkspace(
				workspaceId,
				userIdToRemove,
				(err, updatedWorkspaceData) => {
					if (err) return toasts.generateError(err);
					setUserList((list) =>
						(list || []).filter((user) => user.id !== userIdToRemove)
					);
					setWorkspaceData(updatedWorkspaceData);
					toasts.generateSuccess("Removed user successfully.");
				}
			);
		}
	};

	const updateDocumentsOrder = async (updatedOrder) => {
		// Check if the order of the documents updated.
		if (isUpdatingDocumentOrder.current) return;

		let orderHasUpdated = false;
		const documentOrderUpdates = [];
		for (let i = 0; i < updatedOrder.length; i++) {
			if (workspaceDocuments[i].id !== updatedOrder[i].id) {
				if (!orderHasUpdated) orderHasUpdated = true;
				documentOrderUpdates.push({ id: updatedOrder[i].id, position: i });
			}
		}

		if (!orderHasUpdated) return;

		// Make a request to the backend to update the 'position' field for the documents.
		isUpdatingDocumentOrder.current = true;
		updateDocumentsOrderInDatabase(documentOrderUpdates, (err) => {
			isUpdatingDocumentOrder.current = false;
			if (err) return toasts.generateError(err);
			setWorkspaceDocuments(
				updatedOrder.map((doc, index) => ({ ...doc, position: index }))
			);
		});
	};

	if (!isLoading && (error || !workspaceData)) return <Redirect to="/" />;
	return (
		<WorkspaceContentWrapper>
			<Helmet>
				<title>
					Note It Down - {workspaceData?.identifierEmoji?.emoji || ""}
					{workspaceData?.name || ""}
				</title>
			</Helmet>
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
			<Container centerContent>
				{workspaceDocuments?.length ? (
					<List
						spacing="3"
						textAlign="left"
						minWidth="650px"
						marginTop="2.5rem"
					>
						<ReactSortable
							list={workspaceDocuments}
							setList={updateDocumentsOrder}
							draggable=".draggable"
							delayOnTouchStart
							delay={2}
							animation={200}
						>
							{workspaceDocuments
								.sort((doc1, doc2) =>
									"position" in doc1 && "position" in doc2
										? doc1.position - doc2.position
										: 0
								)
								.map((doc) => (
									<ListItem key={doc.id} className="draggable">
										<DocumentLink
											to={`/editor/document/${doc.id}`}
											target="_blank"
										>
											<Text fontWeight="500">
												{doc.identifierEmoji?.emoji || "📄"} {doc.title}
											</Text>
										</DocumentLink>
									</ListItem>
								))}
						</ReactSortable>
					</List>
				) : (
					<NoneFound label="No Documents Added So far." />
				)}
				<Link style={{ marginTop: "1rem" }} to={`/editor/new/${workspaceId}`}>
					<Button
						colorScheme="blue"
						variant="solid"
						leftIcon={<BiPlus size="1.25rem" />}
					>
						Add New Document
					</Button>
				</Link>
			</Container>
			<UserListModal
				isOpen={isUserListModalOpen}
				onClose={closeUserListModal}
				userList={userList}
				isLoading={isLoadingUserList}
				showOptions={workspaceData?.admins?.includes(user?.uid)}
				onUserRemoveClick={removeUser}
				addNewUser={addNewUser}
			/>
		</WorkspaceContentWrapper>
	);
};

export default WorkspacePage;
