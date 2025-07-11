import { dom, collection, $ } from "../../src/";

// Perform some tests
collection("meta").addClass("happy one");
console.log("are all meta's happy?", collection("meta").hasClass("happy"));

for (const $ele of collection("p")) {
	$ele.after("<p>i am a paragraph</p>");
}

$(document.body).prepend("<p><strong>i am in the body 1</strong></p>");
$(document.body).prepend("<p><strong>i am in the body 2</strong></p>");
$(document.body).prepend("<p><strong>i am in the body 3</strong></p>");

// Color the paragraphs red, green, and blue based on index
collection("p").css("color", (_, i) => {
	return ["red", "green", "blue"][i % 3];
});

// Put all paragraphs in the container
dom(".container").append(collection("p"));

// Prepend a span to the container
dom(".container").prepend(dom("<span>i am a span</span>"));

// Replace all odd paragraphs
collection("p:nth-child(odd)").replaceWith("<p>i am your replacement</p>");

// Copy the container
const $ogContent = collection(".container > *");
const $dupeContainer = dom(`<div class="container">`);

$(document.body).append("<h3>Copy</h3>");
$(document.body).append($dupeContainer);

for (const $clonedItem of $ogContent.clone()) {
	$dupeContainer.append($clonedItem);
}

// Add wer to each paragraph followed by an index
collection("p").forEach(($ele, index) =>
	$ele.append(`<span> wer ${index}</span>`),
);

// Append h4, h5, and h6 to h3
$(["<h4>right</h4>", "<h5>below</h5>", "<h6>here</h6>"]).appendTo("h3");
