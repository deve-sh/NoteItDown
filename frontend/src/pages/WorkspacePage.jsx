import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
	HStack,
	Box,
	Heading,
	Button,
	ButtonGroup,
	IconButton,
} from "@chakra-ui/react";

import { BiUserPlus } from "react-icons/bi";
import { IoTrash } from "react-icons/io5";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";

import ContentWrapper from "Wrappers/ContentWrapper";

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

	if (!isLoading && (error || !workspaceData)) return <Redirect to="/" />;
	return (
		<ContentWrapper>
			<HStack alignItems="center">
				<Box width="50%">
					<Heading as="h4" size="lg">
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
		</ContentWrapper>
	);
};

export default WorkspacePage;
