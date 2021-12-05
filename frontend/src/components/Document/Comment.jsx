import styled from "@emotion/styled";
import { Box, Text, HStack, Avatar } from "@chakra-ui/react";

const CommentWrapper = styled(Box)`
	padding: var(--standard-spacing);
	margin-top: var(--standard-spacing);
	border: 0.075rem solid var(--bordergrey);
`;

const CommentBlockLink = styled.a`
	display: block;
	margin: 0.25rem 0;
	color: var(--chakra-colors-blue-500);
	font-size: calc(0.75 * var(--standard-spacing));
`;

const Comment = ({ comment }) => {
	const commenterName =
		comment?.commenter?.displayName || comment?.commenter?.email;
	return (
		<CommentWrapper shadow="md" borderRadius="md">
			<HStack alignItems="center">
				<HStack flex="1">
					<Avatar
						name={commenterName}
						src={comment?.commenter?.photoURL}
						size="xs"
						title={commenterName}
					/>
					<Text fontSize="sm" flex="1" color="gray">
						{commenterName}
					</Text>
				</HStack>
				<Box flex="1" textAlign="right">
					<Text fontSize="sm" color="gray">
						{comment?.createdAt?.toDate?.()?.toDateString?.()}
						&nbsp;
						{comment?.createdAt?.toDate?.()?.toTimeString?.()?.slice(0, 8)}
					</Text>
				</Box>
			</HStack>
			<Text pt={3}>{comment?.text}</Text>
			{comment?.blocks?.length
				? comment.blocks.map((blockId, index) => (
						<CommentBlockLink href={`#${blockId}`} key={blockId}>
							View Linked Block {index + 1}
						</CommentBlockLink>
				  ))
				: ""}
		</CommentWrapper>
	);
};

export default Comment;
