import Comment from "./Comment";
import sortComments from "helpers/sortComments";

const Comments = ({ commentsData = {} }) =>
	sortComments(Object.values(commentsData?.comments || {}))?.map((comment) => (
		<Comment comment={comment} key={comment.id} />
	));

export default Comments;
