import { useState, useEffect } from "react";
import styled from "@emotion/styled";

import { Box, Text, Divider, HStack, Avatar } from "@chakra-ui/react";
import CommentInputBlock from "./CommentInputBlock";

import { addDocumentComment } from "API/documents";
import toasts from "helpers/toasts";

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

const Comment = ({ comment, reloadCommentsList = () => null }) => {
	const commenterName =
		comment?.commenter?.displayName || comment?.commenter?.email;

	const [replyComment, setReplyComment] = useState({
		text: "",
		mentions: [],
		isReply: true,
		replyTo: comment?.id,
	});

	useEffect(() => {
		if (comment?.id)
			setReplyComment((reply) => ({ ...reply, replyTo: comment.id }));
	}, [comment]);

	const handleNewCommentReplyChange = (text) => {
		setReplyComment({ ...replyComment, text });
	};

	const addCommentReply = () => {
		if (replyComment.text)
			addDocumentComment(
				replyComment,
				comment?.document,
				comment?.workspace,
				(err) => {
					if (err) return toasts.generateError(err);
					toasts.generateSuccess("Added comment reply successfully.");
					reloadCommentsList();
				}
			);
	};

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
			<Divider my={3} />
			<CommentInputBlock
				handleCommentTextChange={handleNewCommentReplyChange}
				addComment={addCommentReply}
				editorUsers={[]}
				isReplyField
			/>
		</CommentWrapper>
	);
};

export default Comment;
