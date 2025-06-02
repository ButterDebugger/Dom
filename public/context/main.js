import { dom, $ } from "../../src/";

// Perform some tests
console.log("* Start of $ tests *\n====================\n");
console.log($);
console.log($(window));
console.log($(document));
console.log("\n====================\n*  End of $ tests  *");

// Replace h3 with h1
dom("h3").replaceWith(
	`<h1 data-hi="burger" alt what=4>bigger hello wonderful</h1>`,
);

// Insert some content after h5
const $h5 = $(document.body).find("h5");

$h5.after("<p><strong>i am in the body 1</strong></p>");
$h5.after("<p><strong>i am in the body 2</strong></p>");
$h5.after("<p><strong>i am in the body 3</strong></p>");

// Append some newly created elements to the body
$(document.body).append(
	dom("<div>Hello World</div>")
		.attr("data-foo", "bar")
		.attr("data-bar", "goo")
		.attr("data-foo", null)
		.style("background-color", "green")
		.style("background-color", null)
		.append(
			dom("<span></span>")
				.text(" (click me)")
				.on("click", () => console.log("Clicked")),
		),
	dom("<pre>Hello World</pre>").text("Hello Text"),
	dom("<pre>Hello World</pre>").html("<strong>Hello HTML</strong>"),
);

// Log a pre element
console.log("a pre", dom("pre"));

// Insert some content into the container
dom(".container").prepend(dom("<span>i am a span</span>"));

dom(".container").after(document.createElement("progress"));
dom(".container").after(
	"<img src='https://debutter.dev/x/img/box.svg' width='64' height='64'>",
);

// Move the container to the bottom
$(document.body).append(dom("div.container"));

// Append something to another thing
$("<span>i am an appended span</span>").appendTo(".container");
$("<span>i am an prepended span</span>").prependTo(".container");
