import styled from "@emotion/styled";
import Mentions from "rc-mentions";
const { Option } = Mentions;

const CommentTextFieldWrapper = styled(Mentions)`
	textarea {
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
	}
`;

const CommentTextField = ({
	isReplyField = false,
	onChange = () => null,
	userOptions = [],
}) => {
	return (
		<CommentTextFieldWrapper
			placeholder={isReplyField ? "Write Your Reply" : "Write your comment"}
			onChange={onChange}
			transitionName="motion"
			$isReplyField={isReplyField}
			className="noprint"
		>
			{userOptions?.length
				? userOptions?.map((user) => (
						<Option value={user.id}>{user.displayName}</Option>
				  ))
				: "No Users Available"}
		</CommentTextFieldWrapper>
	);
};

export default CommentTextField;
