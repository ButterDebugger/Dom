import { dom, type DomContext } from "./context.ts";
import type { DomCommon, DomElements, DomLike } from "./types.ts";

/**
 * Dom-like wrapper for the predefined objects like window and document
 */
export const $: DomCommon = {
    get window(): DomLike {
        return {
            on: <K extends Event>(
                events: string,
                callback: (event: K) => void,
            ) => {
                this.on(window, events, callback);
                return this;
            },
            once: <K extends Event>(
                events: string,
                callback: (event: K) => void,
            ) => {
                this.once(window, events, callback);
                return this;
            },
            off: <K extends Event>(
                events: string,
                callback: (event: K) => void,
            ) => {
                this.off(window, events, callback);
                return this;
            },
        } as unknown as DomLike;
    },
    get document(): DomLike {
        return {
            on: <K extends Event>(
                events: string,
                callback: (event: K) => void,
            ) => {
                this.on(document, events, callback);
                return this;
            },
            once: <K extends Event>(
                events: string,
                callback: (event: K) => void,
            ) => {
                this.once(document, events, callback);
                return this;
            },
            off: <K extends Event>(
                events: string,
                callback: (event: K) => void,
            ) => {
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
    on<K extends Event>(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: (event: K) => void,
    ): void {
        for (const event of events.split(" ")) {
            target.addEventListener(event, callback as EventListener);
        }
    },
    once<K extends Event>(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: (event: K) => void,
    ): void {
        for (const event of events.split(" ")) {
            target.addEventListener(event, callback as EventListener, {
                once: true,
            });
        }
    },
    off<K extends Event>(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: (event: K) => void,
    ): void {
        for (const event of events.split(" ")) {
            target.removeEventListener(event, callback as EventListener);
        }
    },
};
