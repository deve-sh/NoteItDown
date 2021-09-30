import { Container, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FaList } from "react-icons/fa";

const NoneFoundContainer = styled(Container)`
	min-height: 60vh;
    align-items: center;
    justify-content: center;
`;

const NoneFound = ({ label, children }) => (
	<NoneFoundContainer centerContent>
		<FaList size="3.5rem" color="gray" />
		<Text fontSize="md" margin="15px 0" color="gray">
			{label}
		</Text>
		{children}
	</NoneFoundContainer>
);

export default NoneFound;
