/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import {
	Box,
	Input,
	HStack,
	IconButton,
	Menu,
	Heading,
	AvatarGroup,
	Avatar,
	MenuButton,
	MenuList,
} from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { MdClear, MdDelete, MdEdit, MdSave } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { FaFilePdf } from "react-icons/fa";

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
import useStore from "hooks/useStore";

const EditorContainerDiv = styled.div`
	.ce-block {
		position: relative;

		a {
			text-decoration: none;
		}

		&:hover > .block-comment-toggler {
			opacity: 1;
		}
	}

	.tc-table {
		line-height: 2;
		overflow-x: auto;

		&::-webkit-scrollbar {
			width: var(--mini-spacing);
			max-height: calc(0.5 * var(--standard-spacing));
			height: calc(0.5 * var(--standard-spacing));
		}

		&::-webkit-scrollbar-track {
			background: transparent;
			background-clip: content-box;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--bordergrey);
			border-radius: calc(15 * var(--mini-spacing));
		}

		&::-webkit-scrollbar-thumb:hover {
			background: var(--backgroundgrey);
		}

		.tc-row {
			display: flex;
			border-left: 1px solid var(--color-border);

			.tc-cell {
				min-width: 350px;
				max-width: 350px;
			}
		}
	}
`;

const EditorBlockCommentHandler = styled.a`
	position: absolute;
	right: calc(3 * var(--standard-spacing));
	top: 50%;
	transform: translateY(-50%);
	opacity: 0;
	transition: 0.25s;
	text-decoration: none;
	font-size: calc(1.25 * var(--standard-spacing));
`;

const MainInputsStack = styled(HStack)`
	max-width: 650px;
	margin: 0 auto;
	margin-bottom: var(--standard-spacing);
	padding: var(--standard-spacing) var(--standard-spacing);
	padding-bottom: 0;

	&.extrawidth {
		max-width: 900px;
	}
`;

const Editor = ({
	readOnly = false,
	documentData = null,
	prefilledData = null,
	onReady = () => null,
	onSave = () => null,
	toggleEditor = () => null,
	deleteDocument = () => null,
	canEditDocument = false,
	printDocument = () => null,
	editorUsers = [],
	backButtonLink = "",
	handleNewCommentBlockLinking = () => null,
}) => {
	const editor = useRef(null);
	const user = useStore((state) => state.user);

	const [documentTitle, setDocumentTitle] = useState(documentData?.title || "");
	const [identifierEmoji, setIdentifierEmoji] = useState(
		documentData?.identifierEmoji || {}
	);

	const blocksLastEditedBy = useRef(documentData?.blocksLastEditedBy || {});

	const onEmojiSelect = (_, emojiObject) => {
		setIdentifierEmoji(emojiObject);
	};

	const onEditorReady = async (editorRef) => {
		onReady(editorRef);
		if (readOnly) {
			// Setup UI for comments.
			if (prefilledData?.blocks?.length && editorRef?.blocks?.getById) {
				for (let block of prefilledData?.blocks) {
					const blockData = await editorRef?.blocks?.getById(block.id);
					if (blockData.holder && !["image"].includes(blockData.name)) {
						// Create comment toggler element.
						const blockCommentHandler = renderToStaticMarkup(
							<EditorBlockCommentHandler // This is pre-styled component to appear at the right on block hover.
								id={`block-comment-${blockData.id}`}
								className="block-comment-toggler"
								title="Comments Coming Soon"
								href="#comments"
							>
								💬
							</EditorBlockCommentHandler>
						);
						// Add the comment toggler to the right of the element.
						blockData.holder.innerHTML = `${blockData.holder.innerHTML}${blockCommentHandler}`;
						// Add an event listener to the block comment toggler just added above.
						document
							.getElementById(`block-comment-${blockData.id}`)
							.addEventListener("click", () =>
								handleNewCommentBlockLinking(blockData.id)
							);
						blockData.holder.setAttribute("id", blockData.id); // Add id to the id attribute of the block holder to identify block numbers later.
					}
				}
			}
		}
	};

	useEffect(() => {
		if (editor.current) editor.current?.destroy?.();
		document.getElementById("editorjs").innerHTML = "";
		editor.current = new EditorJS({
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
			onReady: () => onEditorReady(editor.current),
			onChange: (editorData) => {
				const currentlyEditedBlockIndex =
					editorData?.blocks?.getCurrentBlockIndex();
				const currentlyEditedBlock = editorData?.blocks?.getBlockByIndex(
					currentlyEditedBlockIndex
				);
				if (currentlyEditedBlock?.id)
					blocksLastEditedBy.current[currentlyEditedBlock.id] = {
						user: user.uid || user.id,
						at: new Date(),
					};
			},
			data: prefilledData,
		});

		return readOnly ? () => null : editor.current?.destroy;
	}, [prefilledData, readOnly]);

	return (
		<div class="editor-wrapper">
			<MainInputsStack
				className={readOnly ? "extrawidth" : ""}
				position="static"
				alignItems="center"
			>
				<Box>
					<Link to={backButtonLink} className="noprint">
						<IconButton variant="ghost" colorScheme="blue">
							<BiArrowBack size="1.5rem" />
						</IconButton>
					</Link>
				</Box>
				{readOnly ? (
					<>
						<Heading as="h2" minWidth="60%" flex="9" margin="0" padding="0">
							{identifierEmoji?.emoji || "📄"} {documentTitle}
						</Heading>
						{editorUsers?.length ? (
							<AvatarGroup size="sm" max={2}>
								{editorUsers.map((user) => (
									<Avatar
										key={user.uid || user.id}
										name={user.displayName || user.email}
										src={user.photoURL}
										title={`${user.displayName || user.email} at ${
											documentData?.editors?.[user.uid || user.id]?.lastAt
												?.toDate?.()
												?.toDateString?.() +
											" " +
											documentData?.editors?.[user.uid || user.id]?.lastAt
												?.toDate?.()
												?.toTimeString?.()
												?.slice(0, 8)
										}`}
									/>
								))}
								{Object.keys(documentData?.editors || {})?.slice?.(2)?.length
									? Object.keys(documentData?.editors || {}).map((userId) => (
											<Avatar key={userId} name={"Another User"} />
									  ))
									: ""}
							</AvatarGroup>
						) : (
							""
						)}
						{canEditDocument && (
							<Box className="noprint">
								<IconButton
									variant="ghost"
									onClick={toggleEditor}
									colorScheme="blue"
								>
									<MdEdit size="1.25rem" />
								</IconButton>
							</Box>
						)}
						{canEditDocument && (
							<Box className="noprint">
								<IconButton
									variant="ghost"
									onClick={deleteDocument}
									colorScheme="red"
								>
									<MdDelete size="1.25rem" />
								</IconButton>
							</Box>
						)}
						<Box flex="1" className="noprint">
							<IconButton
								variant="ghost"
								onClick={printDocument}
								colorScheme="red"
							>
								<FaFilePdf size="1.25rem" />
							</IconButton>
						</Box>
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
						<HStack spacing="2.5" flex="2">
							<IconButton
								variant="ghost"
								onClick={() =>
									onSave(
										documentTitle,
										JSON.parse(JSON.stringify(identifierEmoji)),
										blocksLastEditedBy.current
									)
								}
								colorScheme="blue"
							>
								<MdSave size="1.25rem" />
							</IconButton>
							<IconButton
								variant="ghost"
								onClick={toggleEditor}
								colorScheme="red"
								title="Cancel"
							>
								<MdClear size="1.25rem" />
							</IconButton>
						</HStack>
					</>
				)}
			</MainInputsStack>
			<EditorContainerDiv
				id="editorjs"
				className={readOnly ? "readonly" : ""}
			/>
		</div>
	);
};

export default Editor;
