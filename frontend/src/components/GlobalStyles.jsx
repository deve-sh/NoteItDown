import { Global, css } from "@emotion/react";

const GlobalStyles = ({ darkMode = false }) => (
	<Global
		styles={css`
			:root {
				--white: ${!darkMode ? "#ffffff" : "#1A202C"};
				--black: ${!darkMode ? "#1A202C" : "#ffffff"};
				--darkgrey: #313131;

				--bordergrey: #cfcfcf;
				--backgroundgrey: #efefef;

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
		`}
	/>
);

export default GlobalStyles;
