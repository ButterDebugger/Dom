/**
 * Parses a string of HTML into an Element
 * @param input The HTML string to parse
 * @returns The parsed Element
 */
export function parseHTML(input: string): Element {
    const temp: HTMLDivElement = document.createElement("div");
    temp.innerHTML = input;
    return temp.children[0];
}
