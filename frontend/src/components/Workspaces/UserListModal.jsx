import { useState } from "react";
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
	IconButton,
	HStack,
} from "@chakra-ui/react";
import { RiKeyFill as AdminIcon } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";

import auth from "firebase/authentication";

import NoneFound from "components/NoneFound";
import FormControl from "components/FormControl";

const UserListModal = ({
	showOptions = false,
	userList,
	isOpen,
	onClose,
	isLoading = false,
	onUserRemoveClick = () => null,
	addNewUser = () => null,
}) => {
	const [newUserEmail, setNewUserEmail] = useState("");

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Workspace Users</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{showOptions ? (
						<HStack alignItems="center">
							{/* Section to add new user to workspace */}
							<FormControl
								name="email"
								onChange={(e) => {
									e.persist();
									setNewUserEmail(e.target.value);
								}}
								disabled={isLoading}
								placeholder="New User Email"
							/>
							<IconButton
								colorScheme="teal"
								onClick={() => addNewUser(newUserEmail)}
								disabled={isLoading}
							>
								<FaUserPlus size="1.25rem" />
							</IconButton>
						</HStack>
					) : (
						""
					)}
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
										<Td>
											{showOptions && user.uid !== auth.currentUser.uid ? (
												<>
													<IconButton
														colorScheme="red"
														variant="ghost"
														onClick={() => onUserRemoveClick(user.uid)}
													>
														<MdClose />
													</IconButton>
												</>
											) : (
												""
											)}
										</Td>
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
};

export default UserListModal;
