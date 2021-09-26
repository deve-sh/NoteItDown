import { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

import FormControl from "components/FormControl";

const CreateWorkspaceModalBody = styled(ModalBody)`
	padding: calc(2 * var(--standard-spacing));
	padding-bottom: var(--standard-spacing);
`;

const CreateWorkspaceModal = ({
	isOpen,
	closeModal,
	isLoading,
	onSubmit = () => null,
}) => {
	const [workspaceInputs, setWorkSpaceInputs] = useState({
		name: "",
	});
	const onChange = (event) => {
		setWorkSpaceInputs((inps) => ({
			...inps,
			[event.target.name]: event.target.value,
		}));
	};
	return (
		<Modal isOpen={isOpen} onClose={closeModal}>
			<ModalOverlay />
			<ModalContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(workspaceInputs);
					}}
				>
					<ModalHeader borderBottom="0.075rem solid var(--backgroundgrey)">
						Create Workspace
					</ModalHeader>
					<CreateWorkspaceModalBody>
						<FormControl
							onChange={onChange}
							value={workspaceInputs.name}
							name="name"
							type="text"
							label="Workspace Name"
							id="workspace-name"
							helperText="This name can be changed later of course"
							disabled={isLoading}
						/>
					</CreateWorkspaceModalBody>
					<ModalFooter>
						<Button
							colorScheme="gray"
							variant="ghost"
							mr={3}
							onClick={closeModal}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="solid"
							colorScheme="teal"
							isLoading={isLoading}
						>
							Create WorkSpace
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default CreateWorkspaceModal;
