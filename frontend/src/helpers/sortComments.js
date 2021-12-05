const sortComments = (comments = []) => {
	let sortedComments = [...comments];
	sortedComments.sort(
		(comment1, comment2) =>
			comment2?.createdAt?.toDate?.()?.getTime() -
			comment1?.createdAt?.toDate?.()?.getTime()
	);
	return sortedComments;
};

export default sortComments;
