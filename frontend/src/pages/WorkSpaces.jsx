/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaPlus } from "react-icons/fa";
import styled from "@emotion/styled";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	Stack,
	Heading,
	IconButton,
	useDisclosure as useToggleableModal,
} from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";

import {
	createWorkspace,
	getUserWorkspaces,
	updateWorkspace,
} from "API/workspaces";

import toasts from "helpers/toasts";
import { userHasEditAccessToWorkspace } from "helpers/workspaces";
import useStore from "hooks/useStore";

import FullPageLoader from "components/FullPageLoader";
import ContentWrapper from "Wrappers/ContentWrapper";
import CreateWorkspaceModal from "components/Workspaces/CreateWorkspace";
import EditWorkspaceModal from "components/Workspaces/EditWorkspace";
import NoneFound from "components/NoneFound";

const TableContainer = styled(Table)`
	max-width: 1100px;
	margin: var(--standard-spacing) auto;
	border: 0.075rem solid var(--backgroundgrey);
`;
const Left = styled.div`
	width: 50%;
`;
const Right = styled(Left)`
	width: 50%;
	text-align: right;
`;

const WorkSpaces = () => {
	const user = useStore((state) => state.user);

	const [workspaces, setWorkspaces] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

	const [workspaceToEdit, setWorkspaceToEdit] = useState(null);
	const [isUpdatingWorkspace, setIsUpdatingWorkspace] = useState(false);

	const {
		isOpen: showWorkspaceCreatorModal,
		onOpen: openWorkspaceCreatorModal,
		onClose: closeWorkspaceCreatorModal,
	} = useToggleableModal();

	const {
		isOpen: showWorkspaceEditorModal,
		onOpen: openWorkspaceEditorModal,
		onClose: closeWorkspaceEditorModal,
	} = useToggleableModal();
	const toggleWorkspaceToEdit = (workspaceToStartEditing = null) => {
		if (showWorkspaceEditorModal || !workspaceToStartEditing) {
			setWorkspaceToEdit(null);
			setIsUpdatingWorkspace(false);
			closeWorkspaceEditorModal();
		} else {
			setWorkspaceToEdit(workspaceToStartEditing);
			setIsUpdatingWorkspace(false);
			openWorkspaceEditorModal();
		}
	};

	const fetchUserWorkspaces = async () => {
		getUserWorkspaces(user?.id, (err, fetchedWorkspaces) => {
			setIsLoading(false);
			if (err) return toasts.generateError(err);
			setWorkspaces(fetchedWorkspaces);
		});
	};

	const createNewUserWorkspace = async (workspaceInputs) => {
		setIsCreatingWorkspace(true);
		createWorkspace(workspaceInputs, (err, createdWorkspace) => {
			setIsCreatingWorkspace(false);
			if (err) return toasts.generateError(err);
			setWorkspaces((spaces) => [createdWorkspace, ...spaces]);
			toasts.generateSuccess("Successfully created workspace.");
			closeWorkspaceCreatorModal();
		});
	};

	const updateUserWorkspace = async (workspaceUpdates = {}) => {
		setIsUpdatingWorkspace(true);
		const updates = {
			name: workspaceUpdates.name,
			identifierEmoji: workspaceUpdates.identifierEmoji || null,
		};
		updateWorkspace(workspaceToEdit.id, updates, (err, updatedWorkspace) => {
			setIsUpdatingWorkspace(false);
			if (err) return toasts.generateError(err);
			setWorkspaces((spaces) =>
				spaces.map((space) =>
					space.id === workspaceToEdit.id ? updatedWorkspace : space
				)
			);
			toasts.generateSuccess("Successfully updated workspace.");
			toggleWorkspaceToEdit();
		});
	};

	useEffect(() => {
		fetchUserWorkspaces();
	}, [user]);

	return !isLoading ? (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Note It Down - Workspaces</title>
			</Helmet>
			<CreateWorkspaceModal
				isOpen={showWorkspaceCreatorModal}
				closeModal={closeWorkspaceCreatorModal}
				onSubmit={createNewUserWorkspace}
				isLoading={isCreatingWorkspace}
			/>
			{workspaceToEdit ? (
				<EditWorkspaceModal
					isOpen={showWorkspaceEditorModal}
					closeModal={closeWorkspaceEditorModal}
					onSubmit={updateUserWorkspace}
					isLoading={isUpdatingWorkspace}
					workspace={workspaceToEdit}
				/>
			) : (
				""
			)}
			<ContentWrapper>
				<Stack direction="row" alignItems="center">
					<Left>
						<Heading as="h4" size="md">
							Your Workspaces
						</Heading>
					</Left>
					<Right>
						<Button
							colorScheme="teal"
							onClick={openWorkspaceCreatorModal}
							leftIcon={<FaPlus />}
						>
							Add WorkSpace
						</Button>
					</Right>
				</Stack>
				<TableContainer variant="simple">
					<Thead>
						<Tr>
							<Th>Workspace Name</Th>
							<Th>Number Of Users</Th>
							<Th>Created At</Th>
							<Th>Options</Th>
						</Tr>
					</Thead>
					<Tbody>
						{workspaces?.length ? (
							workspaces.map((workspace) => (
								<Tr key={workspace.id}>
									<Td>
										<Link to={`/workspace/${workspace.id}`}>
											{workspace?.identifierEmoji?.emoji ? (
												<>{workspace.identifierEmoji.emoji}&nbsp;</>
											) : (
												""
											)}
											{workspace.name}
										</Link>
									</Td>
									<Td>{workspace.nUsers}</Td>
									<Td>{workspace?.createdAt?.toDate?.()?.toDateString?.()}</Td>
									<Td>
										{userHasEditAccessToWorkspace(workspace) ? (
											<IconButton
												onClick={() => toggleWorkspaceToEdit(workspace)}
												colorScheme="blue"
												variant="ghost"
											>
												<MdEdit size="1.25rem" />
											</IconButton>
										) : (
											""
										)}
									</Td>
								</Tr>
							))
						) : (
							<Tr>
								<Td rowSpan={4} colSpan={4}>
									<NoneFound label="No Workspaces so far." />
								</Td>
							</Tr>
						)}
					</Tbody>
				</TableContainer>
			</ContentWrapper>
		</>
	) : (
		<FullPageLoader />
	);
};

export default WorkSpaces;
