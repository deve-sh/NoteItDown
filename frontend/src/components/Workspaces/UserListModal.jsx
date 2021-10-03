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
	Table,
	Tbody,
	Tr,
	Td,
	Avatar,
	Text,
} from "@chakra-ui/react";
import { RiKeyFill as AdminIcon } from "react-icons/ri";
import NoneFound from "components/NoneFound";

const UserListModal = ({ userList, isOpen, onClose, isLoading }) => (
	<Modal isOpen={isOpen} onClose={onClose} size="xl">
		<ModalOverlay />
		<ModalContent>
			<ModalHeader>Workspace Users</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				{isLoading ? (
					<Container centerContent>
						<Spinner
							size="xl"
							thickness="4px"
							color="blue.600"
							marginBottom="1rem"
						/>
						Loading User List
					</Container>
				) : userList && userList?.length ? (
					<Table>
						<Tbody>
							{userList.map((user) => (
								<Tr key={user.uid}>
									<Td>
										<Avatar name={user.displayName} src={user.photoURL} />
									</Td>
									<Td>
										{user.displayName}
										{(user.isAdmin || false) && (
											<AdminIcon size="1.125rem" title="Workspace Admin" />
										)}
									</Td>
									<Td>
										<Text color="gray">{user.email}</Text>
									</Td>
									<Td></Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				) : (
					<NoneFound label="No Users In The Workspace" />
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
