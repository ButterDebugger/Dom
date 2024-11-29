import { dom, type DomContext } from "./context.ts";
import type { DomCommon, DomElements, DomLike } from "./types.ts";

/**
 * Dom-like wrapper for the predefined objects like window and document
 */
export const $: DomCommon = {
    get window(): DomLike {
        return {
            on: (events: string, callback: EventListener) => {
                this.on(window, events, callback);
                return this;
            },
            once: (events: string, callback: EventListener) => {
                this.once(window, events, callback);
                return this;
            },
            off: (events: string, callback: EventListener) => {
                this.off(window, events, callback);
                return this;
            },
        } as unknown as DomLike;
    },
    get document(): DomLike {
        return {
            on: (events: string, callback: EventListener) => {
                this.on(document, events, callback);
                return this;
            },
            once: (events: string, callback: EventListener) => {
                this.once(document, events, callback);
                return this;
            },
            off: (events: string, callback: EventListener) => {
                this.off(document, events, callback);
                return this;
            },
        } as unknown as DomLike;
    },
    get head(): DomContext | null {
        return dom(document.head);
    },
    get body(): DomContext | null {
        return dom(document.body);
    },

    // Event listener functions
    on(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: EventListener,
    ): void {
        for (const event of events.split(" ")) {
            target.addEventListener(event, callback);
        }
    },
    once(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: EventListener,
    ): void {
        for (const event of events.split(" ")) {
            target.addEventListener(event, callback, { once: true });
        }
    },
    off(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: EventListener,
    ): void {
        for (const event of events.split(" ")) {
            target.removeEventListener(event, callback);
        }
    },
};
