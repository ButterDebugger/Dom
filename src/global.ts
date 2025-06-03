import { collection, type DomCollection } from "./collection.ts";
import { dom, type DomContext } from "./context.ts";
import type { DomGlobal, DomLike, DomParsable } from "./types.ts";
import { isDomParsable } from "./utils.ts";

/**
 * A caboodle of global helper functions for the Dom library
 *
 * Used to avoid creating a wrapper class for every object
 */
export const $$: DomGlobal = {
    on(target: EventTarget, event: string, callback: EventListener): void {
        target.addEventListener(event, callback);
    },
    once(target: EventTarget, event: string, callback: EventListener): void {
        target.addEventListener(event, callback, {
            once: true,
        });
    },
    off(target: EventTarget, event: string, callback: EventListener): void {
        target.removeEventListener(event, callback);
    },
};

/**
 * @returns A reference to the DomGlobal object, aka $$
 */
export function $(): DomGlobal;
/**
 * Creates a new DomContext from a string
 * @param input An HTML string or query section
 * @returns A new DomContext or null if the input is invalid
 */
export function $<L extends Element = Element>(
    input: string,
): DomContext<L> | null;
/**
 * Creates a new DomContext from an existing element
 * @param input The element to be wrapped
 * @returns A new DomContext
 */
export function $<L extends Element = Element>(input: L): DomContext<L>;
/**
 * Creates a duplicate of the given DomContext
 * @param input The DomContext to duplicate
 * @returns A new DomContext wrapping the same element
 */
export function $<L extends Element = Element>(
    input: DomContext<L>,
): DomContext<L>;
/**
 * Creates a new DomContext from the given input
 * @param input The input to parse
 * @returns A new DomContext
 */
export function $<L extends Element = Element>(
    input: DomParsable,
): DomContext<L>;
/**
 * Creates a new DomCollection from a list of items
 * @param input A list of parsable items to create the collection from
 * @returns A new DomCollection containing the parsed elements
 */
export function $(input: DomParsable[]): DomCollection;
/**
 * Creates a DomLike wrapper object for the given input
 * @param input The input to wrap
 * @returns A new DomLike wrapper object
 */
export function $(input: Window | Document): DomLike;
export function $<L extends Element = Element>(
    input:
        | undefined
        | DomParsable
        | DomParsable[]
        | Window
        | Document = undefined,
): DomGlobal | DomContext<L> | DomCollection | DomLike | null {
    // Return DomGlobal
    if (typeof input === "undefined") {
        return $$;
    }

    // Return DomCollection
    if (Array.isArray(input)) {
        return collection(...input);
    }

    // Return DomContext
    if (isDomParsable(input)) {
        return dom(input);
    }

    // Create an anonymous DomLike wrapper class for the subject
    // TODO: Look into better ways to make a wrapper object
    return new (class implements DomLike {
        on<K extends keyof GlobalEventHandlersEventMap>(
            event: K,
            callback: (event: GlobalEventHandlersEventMap[K]) => void,
        ): DomLike;
        on<E extends Event>(
            event: string,
            callback: (event: E) => void,
        ): DomLike;
        on(event: string, callback: EventListener): DomLike {
            $$.on(input, event, callback);
            return this;
        }

        once<K extends keyof GlobalEventHandlersEventMap>(
            event: K,
            callback: (event: GlobalEventHandlersEventMap[K]) => void,
        ): DomLike;
        once<E extends Event>(
            event: string,
            callback: (event: E) => void,
        ): DomLike;
        once(event: string, callback: EventListener): DomLike {
            $$.once(input, event, callback);
            return this;
        }

        off<K extends keyof GlobalEventHandlersEventMap>(
            event: K,
            callback: (event: GlobalEventHandlersEventMap[K]) => void,
        ): DomLike;
        off<E extends Event>(
            event: string,
            callback: (event: E) => void,
        ): DomLike;
        off(event: string, callback: EventListener): DomLike {
            $$.off(input, event, callback);
            return this;
        }
    })();
}
