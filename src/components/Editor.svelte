<script>
	export let readOnly = false; // For preview modes.
	export let prefilledData = undefined; // For starting from blocks that were already present.

	import { onMount } from "svelte";

	// Editor
	import EditorJS from "@editorjs/editorjs";
	import EditorHeader from "@editorjs/header";
	import EditorSimpleImage from "@editorjs/simple-image";
	import EditorTable from "@editorjs/table";
	import EditorInlineCode from "@editorjs/inline-code";
	import EditorCodeBlock from "@editorjs/code";
	import EditorLink from "@editorjs/link";
	import EditorList from "@editorjs/list";
	import EditorWarning from "@editorjs/warning";
	import EditorDelimiter from "@editorjs/delimiter";

	let editor;

	onMount(() => {
		editor = new EditorJS({
			id: "editorjs",
			placeholder: "Start Typing Here To Edit Document",
			readOnly,
			tools: {
				header: { class: EditorHeader, shortcut: "CMD+SHIFT+H" },
				image: EditorSimpleImage,
				inlineCode: EditorInlineCode,
				code: EditorCodeBlock,
				table: EditorTable,
				delimiter: EditorDelimiter,
				warning: EditorWarning,
				list: { class: EditorList, shortcut: "CMD+7" },
				link: { class: EditorLink, shortcut: "CMD+K" },
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
