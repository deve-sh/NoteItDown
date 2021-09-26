/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaList, FaPlus } from "react-icons/fa";
import styled from "@emotion/styled";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Container,
	Button,
	Stack,
	Heading,
	useDisclosure as useToggleableModal,
} from "@chakra-ui/react";

import { createWorkspace, getUserWorkspaces } from "API/workspaces";

import toasts from "helpers/toasts";
import useStore from "hooks/useStore";

import FullPageLoader from "components/FullPageLoader";
import ContentWrapper from "Wrappers/ContentWrapper";
import CreateWorkspaceModal from "components/Workspaces/CreateWorkspace";

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

	const {
		isOpen: showWorkspaceCreatorModal,
		onOpen: openWorkspaceCreatorModal,
		onClose: closeWorkspaceCreatorModal,
	} = useToggleableModal();

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
						</Tr>
					</Thead>
					<Tbody>
						{workspaces?.length ? (
							workspaces.map((workspace) => (
								<Tr key={workspace.id}>
									<Td>
										<Link to={`/workspace/${workspace.id}`}>
											{workspace.name}
										</Link>
									</Td>
									<Td>{workspace.nUsers}</Td>
									<Td>{workspace?.createdAt?.toDate?.()?.toDateString?.()}</Td>
								</Tr>
							))
						) : (
							<Tr>
								<Td rowSpan={4} colSpan={3}>
									<Container centerContent>
										<FaList size="5rem" color="gray" />
										<Text fontSize="md" marginTop="15px" color="gray">
											No Workspaces so far.
										</Text>
									</Container>
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
