/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import {
	Box,
	Input,
	HStack,
	IconButton,
	Menu,
	Heading,
	MenuButton,
	MenuList,
} from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { MdEdit, MdSave } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";

// Editor
import EditorJS from "@editorjs/editorjs";
import EditorHeader from "@editorjs/header";
import EditorTable from "@editorjs/table";
import EditorInlineCode from "@editorjs/inline-code";
import EditorCodeBlock from "@editorjs/code";
import EditorLink from "@editorjs/link";
import EditorList from "@editorjs/list";
import EditorWarning from "@editorjs/warning";
import EditorDelimiter from "@editorjs/delimiter";
import EditorQuote from "@editorjs/quote";
import EditorEmbed from "@editorjs/embed";
import EditorMarker from "@editorjs/marker";
import EditorImage from "@editorjs/image";
import EditorChecklist from "@editorjs/checklist";

import { uploadImage } from "API/editor";

const EditorContainerDiv = styled.div``;

const MainInputsStack = styled(HStack)`
	max-width: 650px;
	margin: 0 auto;
	margin-bottom: var(--standard-spacing);
`;

const Editor = ({
	readOnly = false,
	documentData = null,
	prefilledData = null,
	onReady = () => null,
	onSave = () => null,
	workspaceId = "",
	toggleEditor = () => null,
	canEditDocument = false,
}) => {
	const editor = useRef(null);

	const [documentTitle, setDocumentTitle] = useState(documentData?.title || "");
	const [identifierEmoji, setIdentifierEmoji] = useState(
		documentData?.identifierEmoji || {}
	);

	const onEmojiSelect = (_, emojiObject) => {
		setIdentifierEmoji(emojiObject);
	};

	useEffect(() => {
		editor.current =
			editor.current ||
			new EditorJS({
				id: "editorjs",
				placeholder: "Start Typing Here To Edit Document",
				readOnly,
				tools: {
					header: {
						class: EditorHeader,
						inlineToolbar: true,
						shortcut: "CMD+SHIFT+H",
						config: {
							placeholder: "Type Your Heading",
							levels: [1, 2, 3, 4, 5, 6],
							defaultLevel: 3,
						},
					},
					embed: EditorEmbed,
					image: {
						class: EditorImage,
						config: {
							uploader: {
								uploadByFile: (file) =>
									new Promise(async (resolve, reject) => {
										const uploadedURL = await uploadImage(file);
										if (!uploadedURL)
											return reject("Image could not be uploaded.");
										return resolve({
											success: 1,
											file: {
												url: uploadedURL,
												name: file.name || "image.png",
												size: file.size,
											},
										});
									}),
								uploadByUrl: (url) =>
									new Promise((resolve) =>
										resolve({
											success: 1,
											file: { url },
										})
									),
							},
						},
					},
					inlineCode: EditorInlineCode,
					code: {
						class: EditorCodeBlock,
						config: { placeholder: "Type Your Code" },
					},
					table: {
						class: EditorTable,
						inlineToolbar: true,
						config: {
							rows: 2,
							cols: 2,
						},
					},
					delimiter: EditorDelimiter,
					warning: {
						class: EditorWarning,
						config: {
							titlePlaceholder: "Warning Title",
							messagePlaceholder: "Warning Message",
						},
					},
					list: { class: EditorList, shortcut: "CMD+7" },
					link: { class: EditorLink, shortcut: "CMD+K" },
					quote: {
						class: EditorQuote,
						inlineToolbar: true,
						shortcut: "CMD+SHIFT+O",
						config: {
							quotePlaceholder: "Enter a quote",
							captionPlaceholder: "Quote's author",
						},
					},
					Marker: {
						class: EditorMarker,
						shortcut: "CMD+SHIFT+M",
					},
					checklist: {
						class: EditorChecklist,
						inlineToolbar: true,
					},
				},
				onReady: () => onReady(editor.current),
				data: prefilledData,
			});

		return readOnly ? () => null : editor.current?.destroy;
	}, [prefilledData, readOnly]);

	return (
		<div class="editor-wrapper">
			<MainInputsStack position="static" alignItems="center">
				<Box>
					<Link to={`/workspace/${workspaceId}`}>
						<IconButton variant="ghost" colorScheme="blue">
							<BiArrowBack size="1.5rem" />
						</IconButton>
					</Link>
				</Box>
				{readOnly ? (
					<>
						<Heading as="h2" margin="0" padding="0">
							{identifierEmoji?.emoji || "📄"} {documentTitle}
						</Heading>
						{canEditDocument && (
							<Box>
								<IconButton
									variant="ghost"
									onClick={toggleEditor}
									colorScheme="blue"
								>
									<MdEdit size="1.25rem" />
								</IconButton>
							</Box>
						)}
					</>
				) : (
					<>
						<Box>
							<Menu>
								<MenuButton as={IconButton} aria-label="Emoji">
									{identifierEmoji?.emoji || "📄"}
								</MenuButton>
								<MenuList border="none" zIndex="1000">
									<EmojiPicker onEmojiClick={onEmojiSelect} />
								</MenuList>
							</Menu>
						</Box>
						<Box flex="9">
							<Input
								label="Document Title"
								id="title"
								value={documentTitle}
								onChange={(e) => setDocumentTitle(e.target.value)}
								placeholder="Document Title"
								variant="unstyled"
								required
							/>
						</Box>
						<Box flex="1">
							<IconButton
								variant="ghost"
								onClick={() =>
									onSave(
										documentTitle,
										JSON.parse(JSON.stringify(identifierEmoji))
									)
								}
								colorScheme="blue"
							>
								<MdSave size="1.25rem" />
							</IconButton>
						</Box>
					</>
				)}
			</MainInputsStack>
			<EditorContainerDiv id="editorjs" />
		</div>
	);
};

export default Editor;
