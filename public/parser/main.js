import { parse, html } from "../../src/";

// parsed paragraph
document.body.appendChild(parse("<p>hello world</p>"));

// parsed button
const btn = parse("<button>Click me</button>");
btn.addEventListener("click", () => {
	alert("clicked");
});
document.body.appendChild(btn);

// template paragraph with string value
document.body.appendChild(html`<p>${"hello template"} number ${10}</p>`);

// template inserted element
document.body.appendChild(
	html`<div>
		${html`<span>${"element inserted from template"}</span>`}
	</div>`,
);

// template button with click handler
const clickHandler = () => console.log("Button Clicked!");
const rightClickHandler = () => console.log("Button Right Clicked!");
document.body.appendChild(
	html`<button onclick=${clickHandler} oncontextmenu=${rightClickHandler}>Click Me 2</button>`,
);
