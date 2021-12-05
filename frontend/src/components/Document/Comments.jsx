import Comment from "./Comment";
import sortComments from "helpers/sortComments";

const Comments = ({
	commentsData = {},
	allowReplies = true,
	isReplyBlock = false,
	reloadCommentsList = () => null,
}) =>
	sortComments(Object.values(commentsData?.comments || {}))?.map((comment) => (
		<Comment
			comment={comment}
			key={comment.id}
			reloadCommentsList={reloadCommentsList}
			allowReplies={allowReplies}
			isReply={isReplyBlock}
		/>
	));

export default Comments;
