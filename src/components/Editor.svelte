<script>
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
		});
	});
</script>

<div class="editor-wrapper">
	<div id="editorjs" />
</div>

<style>
	#editorjs {
		border: 0.1rem solid #efefef;
	}
</style>
