import { useEffect, useRef, useState } from "react";
import db from "../firebase/database"; // Use your firestore instance

const useFirestoreRealTime = (docPath) => {
	let [docData, setDocData] = useState({ fetching: true, data: null });
	let subscriptionRef = useRef(null);

	useEffect(() => {
		let ref = db.doc(docPath);
		subscriptionRef.current = ref.onSnapshot((doc) => {
			const newDocData = { fetching: false, data: doc.data() };
			setDocData(newDocData);
		});

		return () => {
			if (subscriptionRef.current instanceof Function)
				subscriptionRef.current(); // Unsubscribe from document's real-time updates.
		};
	}, [docPath]);

	return docData;
};

export default useFirestoreRealTime;

/** Usage **/
/**
	const docData = useFirestoreRealTime("users/<userid>");	// An update to this will automatically re-render the component too to reflect the latest data.
**/
