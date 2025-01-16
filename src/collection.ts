import type { DomComponent } from "./component.ts";
import { dom, type DomContext } from "./context.ts";
import { parse } from "./parser.ts";
import type { DomParsable } from "./types.ts";
import { isDomParsable, isHTML } from "./utils.ts";

/**
 * Dom wrapper for a list of elements
 */
export class DomCollection extends Array<DomContext> {
    constructor(...args: DomParsable[]) {
        const elements: DomContext[] = [];

        for (const item of args) {
            const ctx = dom(item);
            if (ctx !== null) elements.push(ctx);
        }

        super(...elements);
    }

    /**
     * Gets the element at the given index
     * @param index The index of the element to retrieve
     * @returns The element at the given index, or null
     */
    item(index: number): DomContext | null {
        return this[index] ?? null;
    }

    /**
     * Creates a copy of the collection
     * @returns A new collection containing the same elements
     */
    copy(): DomCollection {
        return new DomCollection(...this);
    }

    /**
     * Creates a new collection of cloned elements
     * @param deep Whether to clone the element and all its children
     * @returns A new collection
     */
    clone(deep = true): DomCollection {
        return new DomCollection(...this.map(($ele) => $ele.clone(deep)));
    }

    /**
     * Finds the first element within this collection of elements that matches the given selector
     * @param selector The selector to search for
     * @param inclusiveScope Whether to include the root of each item in the search
     * @returns A DomContext of the first matching element, or null if no elements were found
     */
    // @ts-ignore: This overrides the parent method correctly
    find(selector: string, inclusiveScope = false): DomContext | null {
        for (const $ele of this) {
            const $item = $ele.find(selector, inclusiveScope);
            if ($item === null) continue;

            return $item;
        }

        return null;
    }

    /**
     * Finds all elements within this collection of elements that matches the given selector
     * @param selector The selector to search for
     * @param inclusiveScope Whether to include the root of each item in the search
     * @returns A DomCollection containing all the matching elements
     */
    findAll(selector: string, inclusiveScope = false): DomCollection {
        let items: DomContext[] = [];

        for (const $ele of this) {
            items = items.concat($ele.findAll(selector, inclusiveScope));
        }

        return collection(...items);
    }

    /**
     * Sets the given attribute
     * @param name The attribute name to set
     * @param value The value to set the attribute to
     * @returns A reference to itself
     */
    attr(name: string, value: string): DomCollection;
    /**
     * Removes the given attribute
     * @param name The attribute name to remove
     * @returns A reference to itself
     */
    attr(name: string, value: null): DomCollection;
    /**
     * Replaces the given attribute using a callback
     * @param name The attribute name to replace
     * @param value The callback that will be called to set the attribute
     * @returns A reference to itself
     */
    attr(
        name: string,
        value: (oldValue: string | null, index: number) => string | null,
    ): DomCollection;
    /**
     * Gets the given attribute
     * @param name The attribute name to get
     * @returns The attributes value
     */
    attr(name: string): (string | null)[];
    /**
     * Retrieves all attributes
     * @returns An object containing all attributes
     */
    attr(): Record<string, string>[];
    /**
     * Manipulates the elements attributes
     */
    attr(
        name: string | undefined = undefined,
        value:
            | string
            | null
            | undefined
            | ((
                oldValue: string | null,
                index: number,
            ) => string | null) = undefined,
    ): DomCollection | Record<string, string>[] | (string | null)[] {
        // Return value
        if (typeof name === "undefined" && typeof value === "undefined") {
            return this.map(($ele) => $ele.attr());
        }

        // The rest of this function only works if there is a name, so return early
        if (typeof name !== "string") {
            return this;
        }

        if (typeof value === "undefined") {
            return this.map(($ele) => $ele.attr(name));
        }

        // Return self
        if (typeof value === "function") {
            for (let i = 0; i < this.length; i++) {
                const $ele = this[i];
                const oldVal = $ele.attr(name);
                const val = value(oldVal, i);

                $ele.attr(name, val);
            }
        } else {
            for (const $ele of this) {
                $ele.attr(name, value);
            }
        }
        return this;
    }

    /**
     * Gets the given property for every element
     * @param name The property name to get
     * @returns The property value
     */
    prop(name: string): unknown[];
    /**
     * Sets the given property for every element
     * @param name The property name to set
     * @param value The value to set the property to
     * @returns A reference to itself
     */
    prop(name: string, value: unknown): DomCollection;
    /**
     * Replaces the given property for every element using a callback
     * @param name The property name to set
     * @param value The value replacement callback
     * @returns A reference to itself
     */
    prop(name: string, value: (oldValue: unknown) => unknown): DomCollection;
    /**
     * Manipulates every elements property
     */
    prop(
        name: string,
        value:
            | undefined
            | unknown
            | ((oldValue: unknown, index: number) => unknown) = undefined,
    ): DomCollection | unknown[] {
        // Return value
        if (typeof value === "undefined") {
            return this.map(($ele) => $ele.prop(name));
        }

        // Return self
        if (typeof value === "function") {
            this.forEach(($ele, index) => {
                const oldVal = $ele.prop(name);
                const val = value(oldVal, index);

                $ele.prop(name, val);
            });
        } else {
            for (const $ele of this) {
                $ele.prop(name, value);
            }
        }
        return this;
    }

    /**
     * Removes the given property from every element
     * @param name The property name to remove
     * @returns A reference to itself
     */
    removeProp(name: string): DomCollection {
        for (const $ele of this) {
            $ele.removeProp(name);
        }
        return this;
    }

    /**
     * Gets the given style for every element
     * @param name The style name to get
     * @returns The style value
     */
    style(name: string): string[];
    /**
     * Sets the given property for every element
     * @param name The property name to set
     * @param value The value to set the property to
     * @returns A reference to itself
     */
    style(name: string, value: string): DomCollection;
    /**
     * Replaces the given style for every element using a callback
     * @param name The style name to set
     * @param value The value replacement callback
     * @returns A reference to itself
     */
    style(
        name: string,
        value: (oldValue: string, index: number) => string,
    ): DomCollection;
    /**
     * Manipulates every elements style
     */
    style(
        name: string,
        value:
            | undefined
            | string
            | ((oldValue: string, index: number) => string) = undefined,
    ): DomCollection | string[] {
        // Return value
        if (typeof value === "undefined") {
            return this.map(($ele) => $ele.style(name));
        }

        // Return self
        if (typeof value === "function") {
            this.forEach(($ele, index) => {
                const oldVal = $ele.style(name);
                const val = value(oldVal, index);

                $ele.style(name, val);
            });
        } else {
            for (const $ele of this) {
                $ele.style(name, value);
            }
        }
        return this;
    }

    /**
     * Gets the given computed style for every element
     * @param name The style property name to get
     * @returns The style property values
     */
    css(name: string): string[];
    /**
     * Sets the given style property for every element
     * @param name The style property name to set
     * @param value The value to set the style property to
     * @returns A reference to itself
     */
    css(name: string, value: string): DomCollection;
    /**
     * Replaces the given style property for each element using a callback
     * @param name The style property name to set
     * @param value The value replacement callback
     * @returns A reference to itself
     */
    css(
        name: string,
        value: (oldValue: string, index: number) => string,
    ): DomCollection;
    /**
     * Manipulates every elements css
     */
    css(
        name: string,
        value:
            | undefined
            | string
            | ((oldValue: string, index: number) => string) = undefined,
    ): DomCollection | string[] {
        // Return value
        if (typeof value === "undefined") {
            return this.map(($ele) => $ele.css(name));
        }

        // Return self
        if (typeof value === "function") {
            for (let i = 0; i < this.length; i++) {
                const $ele = this[i];
                const oldVal = $ele.css(name);
                const val = value(oldVal, i);

                $ele.css(name, val);
            }
        } else {
            for (const $ele of this) {
                $ele.css(name, value);
            }
        }
        return this;
    }

    /**
     * Creates a list of strings containing the inner text of each element
     */
    text(): string[];
    /**
     * Sets the inner text of each element
     * @param value The text to set
     */
    text(value: string): DomCollection;
    /**
     * Manipulates the inner text of each element
     */
    text(value: string | undefined = undefined): DomCollection | string[] {
        // Return value
        if (typeof value === "undefined") {
            return this.map(($ele) => $ele.text());
        }

        // Return self
        for (const $ele of this) {
            $ele.text(value);
        }
        return this;
    }

    /**
     * Creates a list of strings containing the inner html of each element
     */
    html(): string[];
    /**
     * Sets the inner html of each element
     * @param value The html to set
     */
    html(value: string): DomCollection;
    /**
     * Manipulates the inner html of each element
     */
    html(value: string | undefined = undefined): DomCollection | string[] {
        // Return value
        if (typeof value === "undefined") {
            return this.map(($ele) => $ele.html());
        }

        // Return self
        for (const $ele of this) {
            $ele.html(value);
        }
        return this;
    }

    /**
     * Adds one or more class names to each element's class list
     * @param classNames The class names to be added, can be a string separated by spaces or an array of strings
     * @returns A reference to itself
     */
    addClass(...classNames: string[]): DomCollection {
        for (const $ele of this) {
            $ele.addClass(...classNames);
        }
        return this;
    }

    /**
     * Removes one or more class names from each element's class list
     * @param classNames The class names to be removed, can be a string separated by spaces or an array of strings
     * @returns A reference to itself
     */
    removeClass(...classNames: string[]): DomCollection {
        for (const $ele of this) {
            $ele.removeClass(...classNames);
        }
        return this;
    }

    /**
     * Toggles one or more class names in each element's class list
     * @param classNames The class names to be toggled, can be a string separated by spaces or an array of strings
     * @returns A reference to itself
     */
    toggleClass(...classNames: string[]): DomCollection {
        for (const $ele of this) {
            $ele.toggleClass(...classNames);
        }
        return this;
    }

    /**
     * Checks if one or more class names are in every element's class list
     * @param classNames The class names to check, can be a string separated by spaces or an array of strings
     * @returns Whether all class names are in every element's class list
     */
    hasClass(...classNames: string[]): boolean {
        for (const $ele of this) {
            if (!$ele.hasClass(...classNames)) return false;
        }
        return true;
    }

    /**
     * Appends the given content to every element
     * @param children The content to append, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    append(...children: DomParsable[]): DomCollection {
        return this.insert("beforeend", ...children);
    }

    /**
     * Prepends the given content to every element
     * @param children The content to prepend, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    prepend(...children: DomParsable[]): DomCollection {
        return this.insert("afterbegin", ...children);
    }

    /**
     * Inserts the given content after every element
     * @param children The content to insert after, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    after(...contents: DomParsable[]): DomCollection {
        return this.insert("afterend", ...contents);
    }

    /**
     * Inserts the given content before every element
     * @param children The content to insert before, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    before(...contents: DomParsable[]): DomCollection {
        return this.insert("beforebegin", ...contents);
    }

    /**
     * Inserts the given content at the given position of every element
     * @param contents The content to insert, can be a list of anything dom parsable
     * @returns A reference to itself
     */
    insert(where: InsertPosition, ...contents: DomParsable[]): DomCollection {
        for (const content of contents.flat()) {
            for (const $ele of this) {
                $ele.insert(where, content);
            }
        }

        return this;
    }

    /**
     * Replaces every element with the given content
     * @param content The content to replace every element with
     * @returns A reference to itself
     */
    replaceWith(
        content: DomParsable | ((currentContext: DomContext) => DomParsable),
    ): DomCollection {
        for (const $ele of this) {
            $ele.replaceWith(content);
        }
        return this;
    }

    /**
     * Appends an event listener to one or more events for every element
     * @param events A string separated by spaces containing the events to listen for
     * @param callback A function that will be called when the event occurs
     * @returns A reference to itself
     */
    on(events: string, callback: EventListener): DomCollection {
        for (const $ele of this) {
            $ele.on(events, callback);
        }
        return this;
    }

    /**
     * Appends an event listener that only occurs once to one or more events for every element
     * @param events A string separated by spaces containing the events to listen for
     * @param callback A function that will be called for each event once the event occurs
     * @returns A reference to itself
     */
    once(events: string, callback: EventListener): DomCollection {
        for (const $ele of this) {
            $ele.once(events, callback);
        }
        return this;
    }

    /**
     * Removes an event listener from one or more events for every element
     * @param events A string separated by spaces containing the events to remove
     * @param callback The function that was used to register the event
     * @returns A reference to itself
     */
    off(events: string, callback: EventListener): DomCollection {
        for (const $ele of this) {
            $ele.off(events, callback);
        }
        return this;
    }

    /**
     * Applies one or more components to every element
     * @param components List of one or more components to apply
     * @returns A reference to itself
     */
    use(...components: DomComponent[]): DomCollection {
        for (const $ele of this) {
            $ele.use(...components);
        }
        return this;
    }

    /**
     * Removes every element from the collection
     * @returns A reference to itself
     */
    remove(): DomCollection {
        for (const $ele of this) {
            $ele.remove();
        }
        return this;
    }

    /**
     * Gets the bounding rectangle of every element in the collection
     * @returns An array of the bounding rectangle of every element
     */
    boundingRect(): DOMRect[] {
        return this.map(($ele) => $ele.boundingRect());
    }
}

export function collection(...input: DomParsable[]): DomCollection {
    const items: DomContext[] = [];

    for (const item of input) {
        if (typeof item === "string") {
            if (isHTML(item)) {
                const $ele = dom(parse(item));
                if ($ele === null) continue;

                items.push($ele);
            } else {
                for (const element of document.querySelectorAll(item)) {
                    const $ele = dom(element);
                    if ($ele === null) continue;

                    items.push($ele);
                }
            }
        } else if (isDomParsable(item)) {
            const $ele = dom(item);
            if ($ele === null) continue;

            items.push($ele);
        }
    }

    return new DomCollection(...items);
}
