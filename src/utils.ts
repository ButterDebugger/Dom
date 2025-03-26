import { DomCollection } from "./collection.ts";
import { DomElement } from "./component.ts";
import { DomContext } from "./context.ts";
import type { DomParsable } from "./types.ts";

/**
 * Checks if the given string contains HTML tags
 * @param input The string to match against
 * @returns Whether the string contains HTML tags
 */
export function isHTML(input: string): boolean {
    return /<.+>/gm.test(input);
}

/**
 * Checks if the given string is a string literal
 * @param input The string to match against
 * @returns Whether the string is a string literal
 */
export function isStringLiteral(input: string): boolean {
    return /^(?:"(?:.|\n)*"|'(?:.|\n)*'|`(?:.|\n)*`)$/gm.test(input);
}

/**
 * Checks if the given input is a DomContext
 * @param input The input to check
 * @returns Whether the input is a DomContext
 */
export function isContext(input: unknown): input is DomContext {
    return input instanceof DomContext;
}

/**
 * Checks if the given input is a DomCollection
 * @param input The input to check
 * @returns Whether the input is a DomCollection
 */
export function isCollection(input: unknown): input is DomCollection {
    return input instanceof DomCollection;
}

/**
 * Checks if the given input is a DomElement or component
 * @param input The input to check
 * @returns Whether the input is a DomElement or component
 */
export function isComponent(input: unknown): input is DomElement {
    return input instanceof DomElement;
}

/**
 * Checks if the given input can be parsed into a DomContext
 * @param input The input to check
 * @returns Whether the input can be parsed into a DomContext
 */
export function isDomParsable(input: unknown): input is DomParsable {
    return (
        typeof input === "string" ||
        input instanceof HTMLElement ||
        input instanceof Element ||
        isContext(input)
    );
}

/**
 * Gets the depth of an element its element hierarchy
 * @param ele The element to get the hierarchy index of
 * @returns The hierarchy index of the given element
 */
export function getHierarchyIndex(ele: Element): number {
    let iteratedEle = ele;
    let i = 0;

    while (true) {
        const sibling = iteratedEle.previousElementSibling;

        if (sibling !== null) {
            iteratedEle = sibling;
            i += iteratedEle.querySelectorAll("*").length + 1;
            continue;
        }

        const parent = iteratedEle.parentElement;

        if (parent !== null) {
            iteratedEle = parent;
            i++;
            continue;
        }

        break;
    }

    return i;
}

/**
 * Determines whether the target element is a child of the parent element
 * @param target The element to check if it is a child
 * @param parent The possible parent element
 * @returns Whether the target element is a child of the parent
 */
export function isChildOf(target: Element, parent: Element): boolean {
    let iterParent = target.parentElement;
    while (iterParent) {
        if (iterParent === parent) return true;
        iterParent = iterParent.parentElement;
    }
    return false;
}
