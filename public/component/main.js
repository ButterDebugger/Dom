import { component, DomElement, html, css } from "../../dist/index.js";

component(
	class extends DomElement {
		static tagName = "welcome-box";
		static css = css`
			div {
				border: 0.125rem solid salmon;
				border-radius: 0.5rem;
				padding: 0.5rem;
				width: fit-content;
				height: fit-content;
			}
		`;

		template() {
			return html`
				<div>
					<h1>Hello there!</h1>
					<slot></slot>
				</div>
			`;
		}
	},
);
