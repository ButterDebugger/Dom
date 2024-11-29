import type { DomContext } from "./context.ts";

export interface DomLike {
    on: (events: string, callback: EventListener) => DomLike;
    once: (events: string, callback: EventListener) => DomLike;
    off: (events: string, callback: EventListener) => DomLike;
}

export interface DomCommon {
    get window(): DomLike;
    get document(): DomLike;

    get head(): DomContext | null;
    get body(): DomContext | null;

    on(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: EventListener,
    ): void;
    once(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: EventListener,
    ): void;
    off(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: EventListener,
    ): void;
}

export type DomElements = HTMLElement | Element;
export type DomParsable = string | DomElements | DomContext;
