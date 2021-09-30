import useSWR from "swr";

import db from "../firebase/db";

export const constructDocPath = (pathFragments) => {
	let ref = null;
	for (let i = 0; i < pathFragments.length; i++) {
		const fragment = pathFragments[i].replace(/\/\\/g, "");
		if (!ref)
			ref = db[pathFragments.length === 1 ? "doc" : "collection"](fragment);
		else ref = ref[`${i % 2 === 1 ? "doc" : "collection"}`](fragment);
	}
	return ref;
};

const useFirestore = (...pathFragments) => {
	const fetcherFunc = () =>
		constructDocPath(pathFragments)
			.get()
			.then((doc) => {
				if (doc.exists) return doc.data();
				else throw new Error("Document Not Found");
			});
	const { data, error, ...rest } = useSWR(pathFragments.join("/"), fetcherFunc);

	return { data, error, isLoading: !error && !data, ...rest };
};

export default useFirestore;
