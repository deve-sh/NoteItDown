import Comment from "./Comment";

const Comments = ({ commentsData = {} }) =>
	Object.values(commentsData?.comments || {})?.map((comment) => (
		<Comment comment={comment} key={comment.id} />
	));

export default Comments;
