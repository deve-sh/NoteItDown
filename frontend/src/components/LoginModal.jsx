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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { loginWithGoogle, loginWithGithub } from "API/auth";
import toasts from "helpers/toasts";

const LoginModalBody = styled(ModalBody)`
	text-align: center;
	padding: calc(2 * var(--standard-spacing));
	padding-bottom: var(--standard-spacing);
`;

const LoginModal = ({ isOpen, closeModal }) => {
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	const signInUser = (mode = "google") => {
		setIsLoggingIn(true);
		const callback = (err) => {
			setIsLoggingIn(false);
			if (err) return toasts.generateError(err);
		};
		if (mode === "google") loginWithGoogle(callback);
		if (mode === "github") loginWithGithub(callback);
	};

	return (
		<Modal isOpen={isOpen} onClose={closeModal}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader borderBottom="0.075rem solid var(--backgroundgrey)">
					Login
				</ModalHeader>
				<LoginModalBody>
					<Button
						isLoading={isLoggingIn}
						width="100%"
						variant="outline"
						colorScheme="gray"
						leftIcon={<FcGoogle size="1.5rem" />}
						onClick={() => signInUser("google")}
						size="lg"
					>
						Sign In With Google
					</Button>
					<Button
						isLoading={isLoggingIn}
						width="100%"
						variant="outline"
						colorScheme="gray"
						leftIcon={<FaGithub size="1.5rem" />}
						onClick={() => signInUser("github")}
						size="lg"
						marginTop="15px"
					>
						Sign In With Github
					</Button>
				</LoginModalBody>
				<ModalFooter>
					<Button
						colorScheme="gray"
						variant="ghost"
						mr={3}
						onClick={closeModal}
						disabled={isLoggingIn}
					>
						Cancel
					</Button>
					<Button variant="solid" colorScheme="teal" disabled={isLoggingIn}>
						Login
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LoginModal;
