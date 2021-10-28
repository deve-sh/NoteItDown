import { Global, css } from "@emotion/react";

const GlobalStyles = ({ darkMode = false }) => (
	<Global
		styles={css`
			:root {
				--white: ${!darkMode ? "#ffffff" : "#1A202C"};
				--black: ${!darkMode ? "#1A202C" : "#ffffff"};
				--darkgrey: #313131;

				--bordergrey: #cfcfcf;
				--backgroundgrey: ${!darkMode
					? "#efefef"
					: "var(--chakra-colors-gray-600)"};

				--primary: #009688;
				--secondary: #00695f;

				--line-height: 1.61;

				--standard-spacing: 1rem;
				--mid-spacing: 0.875rem;
				--mini-spacing: 0.75rem;
			}

			body {
				padding: 0;
				margin: 0;
				line-height: var(--line-height);
				font-family: "Roboto", "Lato", sans-serif;
				max-width: 100vw;
				overflow-x: hidden;
			}

			html {
				overflow-x: hidden;
				scroll-behavior: smooth;
			}

			#root {
			}

			* {
				box-sizing: border-box;
			}

			a {
				text-decoration: none;
			}

			/* Editor Overwrites */
			#editorjs.readonly {
				.image-tool__caption {
					border: none;
					display: block;
					text-align: center;
					height: auto;
					overflow: hidden;
				}
			}

			#editorjs .ce-header {
				font-weight: 600;
				padding-top: 0.5rem;
				padding-bottom: 2rem;
			}

			#editorjs h1.ce-header {
				font-size: 3rem;
			}

			#editorjs h2.ce-header {
				font-size: 2.5rem;
			}

			#editorjs h3.ce-header {
				font-size: 2rem;
			}

			#editorjs h4.ce-header {
				font-size: 1.5rem;
			}

			#editorjs h5.ce-header {
				font-size: 1.25rem;
			}

			#editorjs h6.ce-header {
				font-size: 1rem;
			}

			@media print {
				.noprint {
					display: none;
				}
			}

			#editorjs {
				.ce-code__textarea {
					font-size: var(--mid-spacing);
				}
			}
		`}
	/>
);

export default GlobalStyles;
