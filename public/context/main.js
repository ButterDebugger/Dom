import { dom, collection, component, $ } from "../../dist/index.js";

// Perform some tests
console.log("\n\n\n\n\n* Start of $ tests *\n====================\n");
console.log($);
console.log($.window);
console.log($.document);
console.log("====================\n*  End of $ tests  *\n\n\n\n\n\n");

const $h3 = dom("h3");
$h3.replaceWith(`<h1 data-hi="burger" alt what=4>bigger hello wonderful</h1>`);
console.log("h3", $h3, $h3.attr());

collection("meta").addClass("happy one");
console.log("has happy", collection("meta").hasClass("happy"));

const $e = dom(`
<Magic apple=2>
	<Toes></Toes>
	<Toes></Toes>
	<Toes>
		<span>i am a span</span>
	</Toes>
</Magic>
`);

const com1 = component()
	.setSelector("Magic")
	.setTemplate("<button>  <slot/>  </button>")
	.setRenderer((ctx, options) => {
		ctx.attr("data-apple", options.apple);
		return ctx;
	})
	.build();

const com2 = component({
	selector: "Toes",
	template: "<span>click me<slot/></span>",
}).build();

$.body.append($e).append(com2.create());

console.log("before", $e);

$e.use(com2, com1);

console.log("after", $e);

$e.on("click mouseover", () => {
	console.log("hey neighbor");
});

dom(".container").after(dom("p"));

for (const $ele of collection("p")) {
	$ele.after("<p>i am a paragraph</p>");
}

$.body.prepend("<p><strong>i am in the body 1</strong></p>");
$.body.prepend("<p><strong>i am in the body 2</strong></p>");
$.body.prepend("<p><strong>i am in the body 3</strong></p>");

$.body.append(
	dom("<div>Hello World</div>")
		.on("click", () => console.log("Clicked"))
		.attr("data-foo", "bar")
		.attr("data-bar", "goo")
		.attr("data-foo", null)
		.style("background-color", "green")
		.style("background-color", null),
	dom("<pre>Hello World</pre>").text("Hello Text"),
	dom("<pre>Hello World</pre>").html("<strong>Hello HTML</strong>"),
);

collection("p").css("color", (_, i) => {
	return ["red", "green", "blue"][i % 3];
});

console.log("ex 1", dom("pre"));
// console.log("ex 2", dom(`"Hey Earl"`));

dom(".container").append(collection("p"));
dom(".container").prepend(dom("<span>i am a span</span>"));

dom(".container").after(document.createElement("canvas"));
dom(".container").after(
	"<img src='https://debutter.dev/x/img/box.svg' width='64' height='64'>",
);

collection("p:nth-child(odd)").replaceWith("<p>i am your replacement</p>");

const $ogContent = collection(".container > *");
const $dupeContainer = dom(`<div class="container">`);

$.body.append($dupeContainer);

for (const $clonedItem of $ogContent.clone()) {
	$dupeContainer.append($clonedItem);
}

collection("p").forEach(($ele, index) =>
	$ele.append(`<span> wer ${index}</span>`),
);
