/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Text, Button, Box } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";

import Editor from "components/Editor";
import ContentWrapper from "Wrappers/ContentWrapper";

import {
	addDocumentToWorkspace,
	getDocumentsFromWorkspace,
	updateDocument,
} from "API/documents";
import { getUsersByIds } from "API/workspaces";
import toasts from "helpers/toasts";

import useFirestore from "hooks/useFirestore";
import useStore from "hooks/useStore";
import useToggle from "hooks/useToggle";
import { getQueryParams } from "helpers/getQueryParams";
import DocumentsList from "components/Workspaces/DocumentsList";

const EditorPage = (props) => {
	const editor = useRef(null);

	const user = useStore((store) => store.user);
	const setLoading = useStore((store) => store.setLoading);

	// These nested document checks are only valid during creation,
	// since while editing, it's just a simple database update operation.
	const parentDocumentId = getQueryParams("parentDocumentId");
	const isCreatingNestedDocument = !!parentDocumentId;

	const [editorUsers, setEditorUsers] = useState([]);

	let workspaceId, documentId;

	const mode = props?.match?.params?.mode;
	if (mode === "new") {
		workspaceId = props?.match?.params?.assetId;
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

	const [childrenDocuments, setChildrenDocuments] = useState([]);
	const isUpdatingDocumentOrder = useRef(false);
	const isFetchingChildrenDocuments = useRef(false);

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

	useEffect(() => {
		if (
			mode !== "new" &&
			documentData?.workspace &&
			documentData?.childrenDocuments?.length &&
			!childrenDocuments?.length &&
			!isFetchingChildrenDocuments.current
		) {
			isFetchingChildrenDocuments.current = true;
			getDocumentsFromWorkspace(
				documentData.workspace,
				documentData.level + 1,
				documentId,
				(err, documents) => {
					console.log(err, documents);
					isFetchingChildrenDocuments.current = false;
					if (err) return toasts.generateError(err);
					setChildrenDocuments(documents);
				}
			);
		}
	}, [documentData]);

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
			if (isCreatingNestedDocument && parentDocumentData) {
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

	const updateDocumentsOrder = async (updatedOrder) => {
		// Check if the order of the documents updated.
		if (isUpdatingDocumentOrder.current) return;

		let orderHasUpdated = false;
		const documentOrderUpdates = [];
		for (let i = 0; i < updatedOrder.length; i++) {
			if (childrenDocuments[i].id !== updatedOrder[i].id) {
				if (!orderHasUpdated) orderHasUpdated = true;
				documentOrderUpdates.push({ id: updatedOrder[i].id, position: i });
			}
		}
		if (!orderHasUpdated) return;

		// Make a request to the backend to update the 'position' field for the documents.
		isUpdatingDocumentOrder.current = true;
		updateDocumentsOrder(documentOrderUpdates, (err) => {
			isUpdatingDocumentOrder.current = false;
			if (err) return toasts.generateError(err);
			setChildrenDocuments(
				updatedOrder.map((doc, index) => ({ ...doc, position: index }))
			);
		});
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
			{documentData?.hasChildDocuments &&
				documentData?.childrenDocuments?.length > 0 &&
				childrenDocuments?.length > 0 && (
					<>
						<Text
							fontSize="lg"
							maxWidth="650px"
							margin="0 auto"
							fontWeight={600}
						>
							Documents Inside This Collection
						</Text>
						<DocumentsList
							documents={childrenDocuments}
							updateDocumentsOrder={updateDocumentsOrder}
							draggable=".draggable"
							className="limitedwidth"
							showDocumentOptions={false}
						/>
					</>
				)}
			{documentData && mode !== "new" ? (
				<Box className="noprint" marginTop="1rem" textAlign="center">
					<Link
						to={`/editor/new/${documentData.workspace}?parentDocumentId=${documentId}`}
					>
						<Button
							colorScheme="blue"
							variant="solid"
							leftIcon={<BiPlus size="1.25rem" />}
						>
							Add Nested Document
						</Button>
					</Link>
				</Box>
			) : (
				""
			)}
		</ContentWrapper>
	);
};

export default EditorPage;
