import { collection, type DomCollection } from "./collection.ts";
import type { DomComponent } from "./component.ts";
import { $ } from "./global.ts";
import { parseHTML } from "./parser.ts";
import type { DomElements, DomLike, DomParsable } from "./types.ts";
import { isComponent, isContext, isDomParsable, isHTML } from "./utils.ts";

/**
 * Dom wrapper for a single element
 */
export class DomContext implements DomLike {
    #ele: HTMLElement | Element;

    constructor(element: HTMLElement | Element) {
        this.#ele = element;
    }

    get element(): HTMLElement | Element {
        return this.#ele;
    }

    /**
     * Clones the current element
     * @param deep Whether to clone the element and all its children
     * @returns A DomContext of the cloned element
     */
    clone(deep = true): DomContext {
        const ctx = dom(<Element> this.#ele.cloneNode(deep));
        if (ctx === null) throw new Error("Failed to clone element");

        return ctx;
    }

    /**
     * Finds the first element within this element that matches the given selector
     * @param selector The selector to search for
     * @param inclusiveScope Whether to include the element itself in the search
     * @returns A DomContext of the first matching element, or null if no elements were found
     */
    find(selector: string, inclusiveScope = false): DomContext | null {
        if (inclusiveScope && this.#ele.matches(selector)) return this;

        const element = this.#ele.querySelector(selector);
        if (element === null) return null;

        return dom(element);
    }

    /**
     * Finds all elements within this element that matches the given selector
     * @param selector The selector to search for
     * @param inclusiveScope Whether to include the element itself in the search
     * @returns A DomCollection containing all the matching elements
     */
    findAll(selector: string, inclusiveScope = false): DomCollection {
        const selection: DomContext[] = [];

        for (const ele of this.#ele.querySelectorAll(selector)) {
            selection.push(dom(ele));
        }

        if (inclusiveScope && this.#ele.matches(selector)) {
            selection.unshift(dom(this.#ele));
        }

        return collection(...selection);
    }

    /**
     * Sets the given attribute
     * @param name The attribute name to set
     * @param value The value to set the attribute to
     * @returns A reference to itself
     */
    attr(name: string, value: string): DomContext;
    /**
     * Removes the given attribute
     * @param name The attribute name to remove
     * @returns A reference to itself
     */
    attr(name: string, value: null): DomContext;
    /**
     * Sets or removes the given attribute
     * @param name The attribute name to remove
     * @returns A reference to itself
     */
    attr(name: string, value: string | null): DomContext;
    /**
     * Replaces the given attribute using a callback
     * @param name The attribute name to replace
     * @param value The callback that will be called to set the attribute
     * @returns A reference to itself
     */
    attr(
        name: string,
        value: (oldValue: string | null) => string | null,
    ): DomContext;
    /**
     * Gets the given attribute
     * @param name The attribute name to get
     * @returns The attributes value
     */
    attr(name: string): string | null;
    /**
     * Retrieves all attributes
     * @returns An object containing all attributes
     */
    attr(): Record<string, string>;
    /**
     * Manipulates the elements attributes
     */
    attr(
        name: string | undefined = undefined,
        value:
            | string
            | null
            | undefined
            | ((oldValue: string | null) => string | null) = undefined,
    ): DomContext | Record<string, string> | string | null {
        // Return value
        if (typeof name === "undefined" && typeof value === "undefined") {
            return this.#ele
                .getAttributeNames()
                .reduce((opt: Record<string, string>, name: string) => {
                    const val = this.#ele.getAttribute(name);
                    if (val === null) return opt;

                    opt[name] = val;
                    return opt;
                }, {});
        }
        if (typeof name === "string" && typeof value === "undefined") {
            return this.#ele.getAttribute(name) ?? null;
        }

        // Return self
        if (typeof name === "string" && typeof value === "function") {
            const oldVal = this.#ele.getAttribute(name);
            const attr = value(oldVal);

            if (attr === null) this.#ele.removeAttribute(name);
            else this.#ele.setAttribute(name, attr);

            return this;
        }
        if (typeof name === "string" && value === null) {
            this.#ele.removeAttribute(name);
            return this;
        }
        if (typeof name === "string" && typeof value === "string") {
            this.#ele.setAttribute(name, value);
            return this;
        }

        throw new TypeError("Arguments have mismatched types");
    }

    /**
     * Gets the given property
     * @param name The property name to get
     * @returns The property value
     */
    prop(name: string): unknown;
    /**
     * Sets the given property
     * @param name The property name to set
     * @param value The value to set the property to
     * @returns A reference to itself
     */
    prop(name: string, value: unknown): DomContext;
    /**
     * Replaces the given property using a callback
     * @param name The property name to set
     * @param value The value replacement callback
     * @returns A reference to itself
     */
    prop(name: string, value: (oldValue: unknown) => unknown): DomContext;
    /**
     * Manipulates the elements property
     */
    prop(
        name: string,
        value:
            | undefined
            | unknown
            | ((oldValue: unknown) => unknown) = undefined,
    ): DomContext | unknown {
        if (typeof name === "undefined") {
            throw new TypeError("Name must be a string");
        }

        // Return value
        if (typeof value === "undefined") {
            // @ts-ignore: Element is an object
            return this.#ele[name];
        }

        // Return self
        if (typeof value === "function") {
            // @ts-ignore: Element is an object
            const oldVal = this.#ele[name];

            // @ts-ignore: Element is an object
            this.#ele[name] = value(oldVal);
        } else {
            // @ts-ignore: Element is an object
            this.#ele[name] = value;
        }
        return this;
    }

    /**
     * Removes the given property
     * @param name The property name to remove
     * @returns A reference to itself
     */
    removeProp(name: string): DomContext {
        // @ts-ignore: Element is an object
        delete this.#ele[name];
        return this;
    }

    /**
     * Gets the given style
     * @param name The style name to get
     * @returns The style value
     */
    style(name: string): string;
    /**
     * Sets the given property
     * @param name The property name to set
     * @param value The value to set the property to
     * @returns A reference to itself
     */
    style(name: string, value: string): DomContext;
    /**
     * Replaces the given style using a callback
     * @param name The style name to set
     * @param value The value replacement callback
     * @returns A reference to itself
     */
    style(name: string, value: (oldValue: string) => string): DomContext;
    /**
     * Manipulates the elements style
     */
    style(
        name: string,
        value: undefined | string | ((oldValue: string) => string) = undefined,
    ): DomContext | string {
        if (!(this.#ele instanceof HTMLElement)) {
            throw new TypeError("Element is not an HTMLElement");
        }

        // Return value
        if (typeof value === "undefined") {
            // @ts-ignore: Element is an object
            return this.#ele.style[name] ?? "";
        }

        // Return self
        if (typeof value === "function") {
            const oldVal = this.style(name);

            // @ts-ignore: Element is an object
            this.#ele.style[name] = value(oldVal);
        } else {
            // @ts-ignore: Element is an object
            this.#ele.style[name] = value;
        }
        return this;
    }

    /**
     * Gets the given computed style
     * @param name The style property name to get
     * @returns The style property value
     */
    css(name: string): string;
    /**
     * Sets the given style property
     * @param name The style property name to set
     * @param value The value to set the style property to
     * @returns A reference to itself
     */
    css(name: string, value: string): DomContext;
    /**
     * Replaces the given style property using a callback
     * @param name The style property name to set
     * @param value The value replacement callback
     * @returns A reference to itself
     */
    css(name: string, value: (oldValue: string) => string): DomContext;
    /**
     * Manipulates the elements css
     */
    css(
        name: string,
        value: undefined | string | ((oldValue: string) => string) = undefined,
    ): DomContext | string {
        if (!(this.#ele instanceof HTMLElement)) {
            throw new TypeError("Element is not an HTMLElement");
        }

        // Return value
        if (typeof value === "undefined") {
            return getComputedStyle(this.#ele).getPropertyValue(name) ?? "";
        }

        // Return self
        if (typeof value === "function") {
            const oldVal = this.css(name);
            const val = value(oldVal);
            const newVal = val.replace(/! ?important$/gm, "");
            const important = val.length !== newVal.length ? "important" : "";

            this.#ele.style.setProperty(name, val, important);
        } else {
            const newVal = value.replace(/! ?important$/gm, "");
            const important = value.length !== newVal.length ? "important" : "";

            this.#ele.style.setProperty(name, value, important);
        }
        return this;
    }

    /**
     * Gets the inner text
     * @returns The inner text of the element
     */
    text(): string;
    /**
     * Sets the inner text
     * @param value The text to set
     * @returns A reference to itself
     */
    text(value: string): DomContext;
    /**
     * Gets or sets the inner text of the element
     */
    text(value: string | undefined = undefined): string | DomContext {
        if (!(this.#ele instanceof HTMLElement)) {
            throw new TypeError("Element is not an HTMLElement");
        }

        // Return value
        if (typeof value === "undefined") {
            return this.#ele.innerText ?? "";
        }

        // Return self
        this.#ele.innerText = value;
        return this;
    }

    /**
     * Gets the inner html
     * @returns The inner html of the element
     */
    html(): string;
    /**
     * Sets the inner html
     * @param value The html to set
     * @returns A reference to itself
     */
    html(value: string): DomContext;
    /**
     * Gets or sets the inner html of the element
     */
    html(value: string | undefined = undefined): string | DomContext {
        // Return value
        if (typeof value === "undefined") {
            return this.#ele.innerHTML ?? "";
        }

        // Return self
        this.#ele.innerHTML = value;
        return this;
    }

    /**
     * Appends the given content to the element
     * @param children The content to append, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    append(...children: DomParsable[]): DomContext {
        return this.insert("beforeend", ...children);
    }

    /**
     * Prepends the given content to the element
     * @param children The content to prepend, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    prepend(...children: DomParsable[]): DomContext {
        return this.insert("afterbegin", ...children);
    }

    /**
     * Inserts the given content after the element
     * @param children The content to insert after, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    after(...contents: DomParsable[]): DomContext {
        return this.insert("afterend", ...contents);
    }

    /**
     * Inserts the given content before the element
     * @param children The content to insert before, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    before(...contents: DomParsable[]): DomContext {
        return this.insert("beforebegin", ...contents);
    }

    /**
     * Inserts the given content at the given position of the element
     * @param contents The content to insert, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    insert(where: InsertPosition, ...contents: DomParsable[]): DomContext {
        for (const content of contents.flat()) {
            let node: Element | null = null;

            if (typeof content === "string") {
                node = dom(content)?.element ?? null;
            } else if (content instanceof Node) {
                node = content;
            } else if (isContext(content)) {
                node = content.element;
            }

            if (node === null) continue;

            this.#ele.insertAdjacentElement(where, node);
        }

        return this;
    }

    /**
     * Replaces the element with the given content
     * @param content The content to replace the element with
     * @returns A reference to itself
     */
    replaceWith(
        content: DomParsable | ((currentContext: DomContext) => DomParsable),
    ): DomContext {
        if (isDomParsable(content)) {
            const node = dom(content)?.element ?? null;
            if (node === null) return this;

            this.#ele.replaceWith(node);
            this.#ele = node;
            return this;
        }
        if (content instanceof Element || content instanceof HTMLElement) {
            this.#ele.replaceWith(content);
            this.#ele = content;
            return this;
        }
        if (isContext(content)) {
            const replacement = content.element;

            this.#ele.replaceWith(replacement);
            this.#ele = replacement;
            return this;
        }
        if (typeof content === "function") {
            this.replaceWith(content(this));
            return this;
        }

        throw new TypeError("Content is an unexpected type");
    }

    /**
     * Adds one or more class names to the element's class list
     * @param classNames The class names to be added, can be a string separated by spaces or an array of strings
     * @returns A reference to itself
     */
    addClass(...classNames: string[]): DomContext {
        const classes = classNames.flatMap((cls) =>
            Array.isArray(cls) ? cls : cls.split(" ")
        );
        this.#ele.classList.add(...classes);
        return this;
    }

    /**
     * Removes one or more class names from the element's class list
     * @param classNames The class names to be removed, can be a string separated by spaces or an array of strings
     * @returns A reference to itself
     */
    removeClass(...classNames: string[]): DomContext {
        const classes = classNames.flatMap((cls) =>
            Array.isArray(cls) ? cls : cls.split(" ")
        );
        this.#ele.classList.remove(...classes);
        return this;
    }

    /**
     * Toggles one or more class names in the element's class list
     * @param classNames The class names to be toggled, can be a string separated by spaces or an array of strings
     * @returns A reference to itself
     */
    toggleClass(...classNames: string[]): DomContext {
        const classes = classNames.flatMap((cls) =>
            Array.isArray(cls) ? cls : cls.split(" ")
        );
        for (const className of classes) {
            this.#ele.classList.toggle(className);
        }
        return this;
    }

    /**
     * Checks if one or more class names are in the element's class list
     * @param classNames The class names to check, can be a string separated by spaces or an array of strings
     * @returns Whether all class names are in the element's class list
     */
    hasClass(...classNames: string[]): boolean {
        const classes = classNames.flatMap((cls) =>
            Array.isArray(cls) ? cls : cls.split(" ")
        );

        for (const className of classes) {
            if (!this.#ele.classList.contains(className)) return false;
        }
        return true;
    }

    /**
     * Appends an event listener to one or more events of the element
     * @param events A string separated by spaces containing the events to listen for
     * @param callback A function that will be called when the event occurs
     * @returns A reference to itself
     */
    on<K extends Event>(
        events: string,
        callback: (event: K) => void,
    ): DomContext {
        $.on(this.#ele, events, callback);
        return this;
    }

    /**
     * Appends an event listener that only occurs once to one or more events of the element
     * @param events A string separated by spaces containing the events to listen for
     * @param callback A function that will be called for each event once the event occurs
     * @returns A reference to itself
     */
    once<K extends Event>(
        events: string,
        callback: (event: K) => void,
    ): DomContext {
        $.once(this.#ele, events, callback);
        return this;
    }

    /**
     * Removes an event listener from one or more events of the element
     * @param events A string separated by spaces containing the events to remove
     * @param callback The function that was used to register the event
     * @returns A reference to itself
     */
    off<K extends Event>(
        events: string,
        callback: (event: K) => void,
    ): DomContext {
        $.off(this.#ele, events, callback);
        return this;
    }

    /**
     * Applies one or more components to the element
     * @param components List of one or more components to apply
     * @returns A reference to itself
     */
    use(...components: DomComponent[]): DomContext {
        let changed: boolean;

        do {
            changed = false;

            for (const component of components) {
                if (!isComponent(component)) {
                    throw new TypeError("Component is not a component.");
                }

                const $prebuild = this.findAll(component.selector, true);

                $prebuild.forEach(($item, index) => {
                    // Get the component's options
                    const options = $item.attr();

                    // Build the component
                    const isRootLevel = this.#ele === $item.element;
                    const isTopLevel = $prebuild.includes($item);

                    const $component = component.create(
                        options,
                        $item.element.children,
                    );
                    $item.replaceWith($component);

                    if (isTopLevel) $prebuild[index] = $component;
                    if (isRootLevel) this.#ele = $item.element;

                    // Mark the change in the building process
                    changed = true;
                });
            }
        } while (changed);

        return this;
    }

    /**
     * Removes the element
     */
    remove(): void {
        this.#ele.remove();
    }

    /**
     * @returns The bounding rectangle of the element
     */
    boundingRect(): DOMRect {
        return this.#ele.getBoundingClientRect();
    }
}

export function dom(input: string): DomContext | null;
export function dom(input: HTMLElement | Element): DomContext;
export function dom(input: DomContext): DomContext;
export function dom(input: DomElements): DomContext;
export function dom(input: DomParsable): DomContext;
export function dom(
    input: string | HTMLElement | Element | DomContext,
): DomContext | null {
    if (typeof input === "string") {
        // Parse input as HTML
        if (isHTML(input)) {
            return new DomContext(parseHTML(input));
        }

        // Query for a matching element
        const element = document.querySelector(input);
        if (element === null) return null;

        return new DomContext(element);
    }
    if (input instanceof HTMLElement || input instanceof Element) {
        return new DomContext(input);
    }
    if (isContext(input)) {
        return input;
    }

    return null;
}
