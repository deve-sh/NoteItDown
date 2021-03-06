import { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Text,
	Container,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import EmojiPicker from "emoji-picker-react";

import FormControl from "components/FormControl";

const EditWorkspaceModalBody = styled(ModalBody)`
	padding: calc(2 * var(--standard-spacing));
	padding-bottom: var(--standard-spacing);
`;

const EditWorkspaceModal = ({
	workspace,
	isOpen,
	closeModal,
	isLoading,
	onSubmit = () => null,
}) => {
	const [workspaceInputs, setWorkSpaceInputs] = useState(
		workspace || {
			name: "",
			identifierEmoji: null,
		}
	);
	const onChange = (event) => {
		setWorkSpaceInputs((inps) => ({
			...inps,
			[event.target.name]: event.target.value,
		}));
	};
	const onEmojiSelect = (_, emojiObject) => {
		setWorkSpaceInputs((inps) => ({
			...inps,
			identifierEmoji: emojiObject,
		}));
	};
	return (
		<Modal isOpen={isOpen} onClose={closeModal}>
			<ModalOverlay />
			<ModalContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(JSON.parse(JSON.stringify(workspaceInputs)));
					}}
				>
					<ModalHeader borderBottom="0.075rem solid var(--backgroundgrey)">
						Edit Workspace
					</ModalHeader>
					<EditWorkspaceModalBody>
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
						<br />
						<Container centerContent>
							{workspaceInputs?.identifierEmoji?.emoji ? (
								<Text color="gray" marginBottom="10px">
									Selected Identifier Emoji:{" "}
									{workspaceInputs.identifierEmoji.emoji}
								</Text>
							) : (
								""
							)}
							<EmojiPicker onEmojiClick={onEmojiSelect} />
						</Container>
					</EditWorkspaceModalBody>
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
							Update WorkSpace
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default EditWorkspaceModal;
