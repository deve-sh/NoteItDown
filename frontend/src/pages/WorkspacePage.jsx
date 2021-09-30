import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
	HStack,
	Box,
	Heading,
	Button,
	ButtonGroup,
	IconButton,
	List,
	ListItem,
} from "@chakra-ui/react";

import { BiPlus, BiUserPlus } from "react-icons/bi";
import { IoTrash } from "react-icons/io5";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";
import { getDocumentsFromWorkspace } from "API/documents";

import toasts from "helpers/toasts";

import ContentWrapper from "Wrappers/ContentWrapper";
import NoneFound from "components/NoneFound";

const WorkspacePage = (props) => {
	const user = useStore((state) => state.user);
	const setLoading = useStore((store) => store.setLoading);

	const workspaceId = props?.match?.params?.workspaceId;

	const {
		data: workspaceData,
		error,
		isLoading,
	} = useFirestore(`workspaces/${workspaceId}` || null);

	useEffect(() => {
		setLoading(isLoading);
	}, [setLoading, isLoading]);

	const [workspaceDocuments, setWorkspaceDocuments] = useState([]);

	useEffect(() => {
		getDocumentsFromWorkspace(workspaceId, 1, (err, documents) => {
			if (err) return toasts.generateError(err);
			setWorkspaceDocuments(documents || []);
		});
	}, [workspaceId]);

	if (!isLoading && (error || !workspaceData)) return <Redirect to="/" />;
	return (
		<ContentWrapper>
			<HStack alignItems="center">
				<Box width="50%">
					<Heading as="h4" size="lg">
						{workspaceData?.identifierEmoji?.emoji}
						{workspaceData?.name}
					</Heading>
				</Box>
				<Box width="50%" textAlign="right">
					{workspaceData?.admins?.includes(user?.uid) && (
						<ButtonGroup spacing="3">
							<Button
								colorScheme="teal"
								variant="solid"
								leftIcon={<BiUserPlus size="1.25rem" />}
							>
								Add User
							</Button>
							<IconButton variant="ghost" colorScheme="red">
								<IoTrash />
							</IconButton>
						</ButtonGroup>
					)}
				</Box>
			</HStack>
			{workspaceDocuments?.length ? (
				<List spacing="3">
					{workspaceDocuments.map((doc) => (
						<ListItem key={doc.id}>{doc.title}</ListItem>
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
		</ContentWrapper>
	);
};

export default WorkspacePage;
