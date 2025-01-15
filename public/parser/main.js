import { parseHTML } from "../../dist/index.js";

document.body.appendChild(parseHTML("<p>hello world</p>"));

const btn = parseHTML("<button>Click me</button>");
btn.addEventListener("click", () => {
	alert("clicked");
});

document.body.appendChild(btn);
