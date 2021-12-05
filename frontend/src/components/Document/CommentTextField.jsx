import styled from "@emotion/styled";

const CommentTextArea = styled.textarea`
	width: 100%;
	border: 0.075rem solid var(--bordergrey);
	border-radius: calc(0.25 * var(--standard-spacing));
	padding: ${({ $isReplyField }) =>
		$isReplyField
			? "calc(0.5 * var(--standard-spacing))"
			: "var(--standard-spacing)"};
	min-height: ${({ $isReplyField }) => ($isReplyField ? "1.5vh" : "15vh")};
	background: var(--white);
	color: var(--black);
	margin-top: calc(0.25 * var(--standard-spacing));
`;

const CommentTextField = ({
	isReplyField = false,
	onChange = () => null,
	commentText = "",
}) => (
	<CommentTextArea
		placeholder={isReplyField ? "Write Your Reply" : "Write your comment"}
		value={commentText}
		onChange={onChange}
		transitionName="motion"
		$isReplyField={isReplyField}
		rows={isReplyField ? 1 : undefined}
	/>
);

export default CommentTextField;
