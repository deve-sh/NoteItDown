<script>
	export let readOnly = false; // For preview modes.
	export let prefilledData = undefined; // For starting from blocks that were already present.

	import { onMount } from "svelte";

	import { uploadImage } from "../API/editor";

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
	import EditorChecklist from '@editorjs/checklist';

	let editor;

	onMount(() => {
		editor = new EditorJS({
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
			onReady: () => null,
			onChange: () => null,
			data: prefilledData,
		});

		return () => {
			editor.destroy();
		};
	});

	const getEditorData = async () => {
		if (editor) return await editor.save();
		return {};
	};
</script>

<div class="editor-wrapper">
	<div id="editorjs" />
</div>

<style>
</style>
