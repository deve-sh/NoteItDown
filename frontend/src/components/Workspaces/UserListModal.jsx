import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Container,
	Spinner,
} from "@chakra-ui/react";

const UserListModal = ({ userList, isOpen, onClose }) => (
	<Modal isOpen={isOpen} onClose={onClose} size="xl">
		<ModalOverlay />
		<ModalContent>
			<ModalHeader>Workspace Users</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				{!userList ? (
					<Container centerContent>
						<Spinner
							size="xl"
							thickness="4px"
							color="blue.600"
							marginBottom="1rem"
						/>
						Loading User List
					</Container>
				) : (
					"User List To Appear Here"
				)}
			</ModalBody>

			<ModalFooter>
				<Button colorScheme="red" onClick={onClose}>
					Close
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>
);

export default UserListModal;
