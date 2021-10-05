import { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";

import Editor from "components/Editor";
import ContentWrapper from "Wrappers/ContentWrapper";

import { addDocumentToWorkspace, updateDocument } from "API/documents";
import toasts from "helpers/toasts";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";
import useToggle from "hooks/useToggle";

const EditorPage = (props) => {
	const editor = useRef(null);

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
		mutate: setDocumentData,
	} = useFirestore(documentId ? `documents/${documentId}` : null);

	useEffect(() => {
		return () => setLoading(false);
	}, [setLoading]);

	const [isEditable, toggleEditor] = useToggle(false);

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

	const saveDocument = async (title, identifierEmoji) => {
		const editorData = documentData?.editorData
			? documentData?.editorData
			: await getEditorContent();
		if (mode === "new") {
			addDocumentToWorkspace(
				workspaceId,
				{ editorData, level: 1, title, identifierEmoji },
				(err, documentCreated) => {
					if (err) return toasts.generateError(err);
					window.location = `/editor/document/${documentCreated.id}`; // Take the user to the dedicated document page.
				}
			);
		} else {
			const updates = { editorData, title, identifierEmoji };
			updateDocument(documentId, updates, (err, updatedDocData) => {
				if (err) return toasts.generateError(err);
				setDocumentData(updatedDocData);
			});
		}
	};

	return (
		<ContentWrapper>
			<Helmet>
				<title>{documentData?.title || "NoteItDown - Editor"}</title>
			</Helmet>
			{mode !== "new" && !documentData?.editorData ? (
				<></>
			) : (
				<Editor
					onReady={(editorInstance) => (editor.current = editorInstance)}
					readOnly={mode !== "new" && !isEditable}
					toggleEditor={toggleEditor}
					prefilledData={documentData?.editorData}
					onSave={saveDocument}
					documentData={documentData}
					workspaceId={workspaceId || documentData?.workspace}
				/>
			)}
		</ContentWrapper>
	);
};

export default EditorPage;
