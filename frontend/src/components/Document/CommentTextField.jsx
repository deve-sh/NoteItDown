import styled from "@emotion/styled";
import Mentions from "rc-mentions";
const { Option } = Mentions;

const CommentTextFieldWrapper = styled(Mentions)`
	textarea {
		width: 100%;
		border: 0.075rem solid var(--bordergrey);
		padding: var(--standard-spacing);
		min-height: 15vh;
		background: var(--white);
		color: var(--black);
	}
`;

const CommentTextField = ({ onChange = () => null, userOptions = [] }) => {
	return (
		<CommentTextFieldWrapper
			placeholder="Write your comment"
			onChange={onChange}
			transitionName="motion"
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
