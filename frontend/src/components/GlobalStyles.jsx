import { Global, css } from "@emotion/react";

const GlobalStyles = () => (
	<Global
		styles={css`
			:root {
				--white: #ffffff;
				--black: #212121;
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
				background: var(--white);
				color: var(--black);
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
