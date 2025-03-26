/**
 * Parses a string of HTML into an Element
 * @param input The HTML string to parse
 * @returns The parsed Element
 */
export function parse(input: string): Element {
    const temp: HTMLDivElement = document.createElement("div");
    temp.innerHTML = input;
    return temp.children[0];
}

/**
 * Creates a CSS string using a template literal
 *
 * Mainly used to trigger syntax highlighting in most IDEs,
 * doesn't have any actual functionality beyond that at the moment
 * @param strings The split template literal strings
 * @param values The values of the template literal
 * @returns A concatenated string of the template literal
 */
export function css(
    strings: TemplateStringsArray,
    ...values: unknown[]
): string {
    let str = "";

    for (let i = 0; i < values.length; i++) {
        str += strings[i] + String(values[i]);
    }

    return str + strings[strings.length - 1];
}

/**
 * Creates an element using a template literal
 * @param strings The split template literal strings
 * @param values The values of the template literal
 * @returns The parsed Element
 */
export function html(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Element {
    // Merge the html template string and keep track of all placeholders
    const functionPlaceholders: Record<string, unknown> = {};
    const elementPlaceholders: Record<string, Element> = {};

    const html = strings.reduce((acc, curr, i) => {
        // Skips the last element
        if (i >= values.length) return acc + curr;

        // Handle the placeholder value depending on its type
        const value = values[i];

        if (typeof value === "function") {
            // Assume that the function was placed as an attribute value and insert a placeholder instead
            const placeholder = `__FN_PLACEHOLDER__${i}__`;
            functionPlaceholders[placeholder] = value;
            return acc + curr + placeholder;
        }

        if (value instanceof Element) {
            // Assume that the element was placed inside another element and insert a placeholder element instead
            const placeholder = `ELE_PLACEHOLDER__${i}`;
            const placeholderEle = `<${placeholder}></${placeholder}>`;
            elementPlaceholders[placeholder] = value;
            return acc + curr + placeholderEle;
        }

        // Default to simply appending the value as a string
        return acc + curr + String(value);
    }, "");

    // Create a template element using the HTML string
    const template = document.createElement("template");
    template.innerHTML = html.trim();

    // Walk through the DOM tree to apply placeholders
    const walker = document.createTreeWalker(
        template.content,
        NodeFilter.SHOW_ELEMENT,
    );

    while (walker.nextNode()) {
        const node = walker.currentNode as HTMLElement;

        // Check if the node is an element placeholder
        const tagMatch = /ELE_PLACEHOLDER__(\d+)/g.exec(node.tagName);
        if (tagMatch !== null) {
            // Get and replace the placeholder element with the actual element
            const placeholder = tagMatch[0];
            const element = elementPlaceholders[placeholder];

            node.replaceWith(element);
            continue;
        }

        // Loop through each attribute
        for (const attr of Array.from(node.attributes)) {
            const originalValue = attr.value;

            // Check if the attribute value is a function placeholder
            const fnMatch = /__FN_PLACEHOLDER__(\d+)__/g.exec(originalValue);
            if (fnMatch !== null) {
                const placeholder = fnMatch[0];
                const fn = functionPlaceholders[placeholder];

                // Replace the function placeholder with the actual function
                if (attr.name.startsWith("on") && typeof fn === "function") {
                    // Remove the "on" from the attribute name
                    const eventType = attr.name.slice(2).toLowerCase();

                    // Add the event listener
                    node.addEventListener(eventType, fn as EventListener);

                    // Remove the inline attribute
                    node.removeAttribute(attr.name);
                }
            }
        }
    }

    // Get the first child element
    const ele = template.content.firstElementChild;

    // Throw an error if there is no element
    if (ele === null) {
        throw new Error("templateHTML did not produce any element");
    }

    // Return the element
    return ele;
}
