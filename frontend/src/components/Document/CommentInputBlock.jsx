import { HStack, IconButton, Box, Text } from "@chakra-ui/react";
import { BiSend } from "react-icons/bi";

import CommentTextField from "./CommentTextField";

const CommentInputBlock = ({
	editorUsers = [],
	comment,
	handleCommentTextChange = () => null,
	addComment,
	isReplyField = false,
}) => (
	<div className="noprint">
		<HStack width="100%" alignItems="center">
			<Box flex={11}>
				{!isReplyField && comment?.blocks?.length > 0 && (
					<Text fontSize="sm" color="gray">
						Your Comment will be linked to the blocks you clicked on.
						<br />
						Click On Those Block Comment Buttons again to remove them from this
						comment.
						<br />
					</Text>
				)}
				<CommentTextField
					userOptions={editorUsers || []}
					onChange={handleCommentTextChange}
					isReplyField={isReplyField}
					commentText={comment?.text || ""}
				/>
			</Box>
			<Box flex={1} textAlign="right">
				<IconButton colorScheme="blue" onClick={addComment}>
					<BiSend size="1.5rem" />
				</IconButton>
			</Box>
		</HStack>
	</div>
);

export default CommentInputBlock;
