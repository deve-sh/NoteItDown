import { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";

import Editor from "components/Editor";
import ContentWrapper from "Wrappers/ContentWrapper";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";

const EditorPage = (props) => {
	const editor = useRef(null);

	const user = useStore((state) => state.user);
	const setLoading = useStore((store) => store.setLoading);

	let workspaceId, documentId;

	const mode = props?.match?.params?.mode;
	if (mode === "new") workspaceId = props?.match?.params?.assetId;
	else documentId = props?.match?.params?.assetId;

	const {
		data: workspaceData,
		error: workspaceError,
		isLoading: workspaceLoading,
	} = useFirestore(workspaceId ? `workspaces/${workspaceId}` : null);
	const {
		data: documentData,
		error: documentError,
		isLoading: documentLoading,
	} = useFirestore(documentId ? `documents/${documentId}` : null);

	useEffect(() => {
		return () => setLoading(false);
	}, [setLoading]);

	useEffect(() => {
		if ((workspaceId && workspaceLoading) || (documentId && documentLoading))
			setLoading(true);
		else setLoading(false);
	}, [workspaceId, documentId, workspaceLoading, documentLoading, setLoading]);

	if (workspaceId && !workspaceLoading && (workspaceError || !workspaceData))
		return <Redirect to="/" />;
	if (documentId && !documentLoading && (documentError || !documentData))
		return <Redirect to="/" />;

	const getEditorContent = async () =>
		(await editor.current?.save?.()) || {
			blocks: [],
			time: new Date().getTime(),
		};

	return (
		<ContentWrapper>
			<Editor onReady={(editorInstance) => (editor.current = editorInstance)} />
		</ContentWrapper>
	);
};

export default EditorPage;
