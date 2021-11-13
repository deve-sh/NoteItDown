/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";

import Editor from "components/Editor";
import ContentWrapper from "Wrappers/ContentWrapper";

import { addDocumentToWorkspace, updateDocument } from "API/documents";
import { getUsersByIds } from "API/workspaces";
import toasts from "helpers/toasts";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";
import useToggle from "hooks/useToggle";
import { getQueryParams } from "helpers/getQueryParams";

const EditorPage = (props) => {
	const editor = useRef(null);

	const user = useStore((store) => store.user);
	const setLoading = useStore((store) => store.setLoading);

	const isNestedDocument = window.location.href.includes("nested");

	const [editorUsers, setEditorUsers] = useState([]);

	let workspaceId, documentId, parentDocumentId;

	const mode = props?.match?.params?.mode;
	if (mode === "new") {
		workspaceId = props?.match?.params?.assetId;
		if (isNestedDocument) parentDocumentId = getQueryParams("parentDocumentId");
	} else documentId = props?.match?.params?.assetId;

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
	const {
		data: parentDocumentData,
		error: parentDocumentError,
		isLoading: parentDocumentLoading,
	} = useFirestore(parentDocumentId ? `documents/${parentDocumentId}` : null);

	useEffect(() => /* Cleanup Loading State */ () => setLoading(false), []);

	useEffect(() => {
		if (
			documentData &&
			!editorUsers?.length &&
			Object.keys(documentData?.editors || {}).length
		) {
			const editorUsersIds = Object.keys(documentData?.editors).slice(0, 2);
			getUsersByIds(editorUsersIds, (err, users) => {
				if (err) return toasts.generateError(err);
				setEditorUsers(users);
			});
		}
	}, [documentData]);

	const [isEditable, toggleEditor] = useToggle(false);

	useEffect(() => {
		if ((workspaceId && workspaceLoading) || (documentId && documentLoading))
			setLoading(true);
		else setLoading(false);
	}, [workspaceId, documentId, workspaceLoading, documentLoading, setLoading]);

	const printDocument = () => {
		// First resizing all text-areas for code.
		const textAreas = document.getElementsByTagName("textarea");
		for (let i = 0; i < textAreas.length; i++) {
			textAreas[i].style.height = "5px";
			textAreas[i].style.height = textAreas[i].scrollHeight + 15 + "px";
		}
		// Removing an additional 300px bottom padding from code editor areas
		const codeEditorArea = document.getElementsByClassName(
			"codex-editor__redactor"
		)[0];
		if (codeEditorArea) codeEditorArea.style.paddingBottom = "5px";
		window.print();
	};

	if (workspaceId && !workspaceLoading && (workspaceError || !workspaceData))
		return <Redirect to="/" />;
	if (documentId && !documentLoading && (documentError || !documentData))
		return <Redirect to="/" />;
	if (
		parentDocumentId &&
		!parentDocumentLoading &&
		(parentDocumentError || !parentDocumentData)
	)
		return <Redirect to="/" />;

	const getEditorContent = async () =>
		(await editor.current?.save?.()) || {
			blocks: [],
			time: new Date().getTime(),
		};

	const saveDocument = async (
		title,
		identifierEmoji,
		blocksLastEditedBy = {}
	) => {
		const editorData =
			isEditable || !documentData?.editorData
				? JSON.stringify(await getEditorContent())
				: documentData?.editorData || {};
		if (mode === "new") {
			let newDocumentData = {
				editorData,
				level: 1,
				title,
				identifierEmoji,
				blocksLastEditedBy,
			};
			if (isNestedDocument && parentDocumentData) {
				newDocumentData.level = (parentDocumentData.level || 1) + 1;
				newDocumentData.isChildDocument = true;
				newDocumentData.parentDocument = parentDocumentId;
			}
			addDocumentToWorkspace(
				workspaceId,
				newDocumentData,
				(err, documentCreated) => {
					if (err) return toasts.generateError(err);
					window.location = `/editor/document/${documentCreated.id}`; // Take the user to the dedicated document page.
				}
			);
		} else {
			const updates = { editorData, title, identifierEmoji };
			if (Object.keys(blocksLastEditedBy).length) {
				for (let blockId of Object.keys(blocksLastEditedBy))
					updates[`blocksLastEditedBy.${blockId}`] =
						blocksLastEditedBy[blockId];
			}
			updateDocument(documentId, updates, (err, updatedDocData) => {
				if (err) return toasts.generateError(err);
				setDocumentData(updatedDocData);
				toggleEditor(); // Close editor.
			});
		}
	};

	return (
		<ContentWrapper>
			<Helmet>
				<title>{documentData?.title || "Note It Down - Editor"}</title>
			</Helmet>
			{mode !== "new" && !documentData?.editorData ? (
				<></>
			) : (
				<Editor
					onReady={(editorInstance) => (editor.current = editorInstance)}
					readOnly={mode !== "new" && !isEditable}
					toggleEditor={toggleEditor}
					prefilledData={(() => {
						try {
							return documentData?.editorData
								? JSON.parse(documentData.editorData)
								: null;
						} catch (err) {
							console.log(err);
							return null;
						}
					})()}
					onSave={saveDocument}
					documentData={documentData}
					workspaceId={workspaceId || documentData?.workspace}
					canEditDocument={
						workspaceData?.users?.includes(user.uid) ||
						documentData?.createdBy === user.uid
					}
					printDocument={printDocument}
					editorUsers={editorUsers}
				/>
			)}
		</ContentWrapper>
	);
};

export default EditorPage;
