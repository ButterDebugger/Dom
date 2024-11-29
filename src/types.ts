import type { DomContext } from "./context.ts";

export interface DomLike {
    on: <K extends Event>(
        events: string,
        callback: (event: K) => void,
    ) => DomLike;
    once: <K extends Event>(
        events: string,
        callback: (event: K) => void,
    ) => DomLike;
    off: <K extends Event>(
        events: string,
        callback: (event: K) => void,
    ) => DomLike;
}

export interface DomCommon {
    get window(): DomLike;
    get document(): DomLike;

    get head(): DomContext | null;
    get body(): DomContext | null;

    on<K extends Event>(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: (event: K) => void,
    ): void;
    once<K extends Event>(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: (event: K) => void,
    ): void;
    off<K extends Event>(
        target: Document | DomElements | (Window & typeof globalThis),
        events: string,
        callback: (event: K) => void,
    ): void;
}

export type DomElements = HTMLElement | Element;
export type DomParsable = string | DomElements | DomContext;
