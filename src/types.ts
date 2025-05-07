import type { DomContext } from "./context.ts";

export interface DomLike {
    /**
     * Appends an event listener
     * @param event The event type to listen for
     * @param callback The function that will be called every time the event occurs
     * @returns A reference to itself
     */
    on<K extends keyof GlobalEventHandlersEventMap>(
        event: K,
        callback: (event: GlobalEventHandlersEventMap[K]) => void,
    ): DomLike;
    on<E extends Event>(event: string, callback: (event: E) => void): DomLike;

    /**
     * Appends an event listener that only occurs once
     * @param event The event type to listen for
     * @param callback The function that will be called once the event occurs
     * @returns A reference to itself
     */
    once<K extends keyof GlobalEventHandlersEventMap>(
        event: K,
        callback: (event: GlobalEventHandlersEventMap[K]) => void,
    ): DomLike;
    once<E extends Event>(event: string, callback: (event: E) => void): DomLike;

    /**
     * Removes an event listener
     * @param event The event type to remove the listener from
     * @param callback The function that was used to register the event
     * @returns A reference to itself
     */
    off<K extends keyof GlobalEventHandlersEventMap>(
        event: K,
        callback: (event: GlobalEventHandlersEventMap[K]) => void,
    ): DomLike;
    off<E extends Event>(event: string, callback: (event: E) => void): DomLike;
}

export interface DomGlobal {
    /**
     * Defines a event listener onto the given event target
     * @param target The event target
     * @param event The event type to listen for
     * @param callback The function that will be called every time the event occurs
     */
    on<K extends keyof GlobalEventHandlersEventMap>(
        target: EventTarget,
        event: K,
        callback: (event: GlobalEventHandlersEventMap[K]) => void,
    ): void;
    on<E extends Event>(
        target: EventTarget,
        event: string,
        callback: (event: E) => void,
    ): void;

    /**
     * Defines a event listener that only occurs once onto the given event target
     * @param target The event target
     * @param event The event type to listen for
     * @param callback The function that will be called once the event occurs
     */
    once<K extends keyof GlobalEventHandlersEventMap>(
        target: EventTarget,
        event: K,
        callback: (event: GlobalEventHandlersEventMap[K]) => void,
    ): void;
    once<E extends Event>(
        target: EventTarget,
        event: string,
        callback: (event: E) => void,
    ): void;

    /**
     * Removes a event listener from the given event target
     * @param target The event target
     * @param event The event type tp remove the listener from
     * @param callback The function that was used to register the event
     */
    off<K extends keyof GlobalEventHandlersEventMap>(
        target: EventTarget,
        event: K,
        callback: (event: GlobalEventHandlersEventMap[K]) => void,
    ): void;
    off<E extends Event>(
        target: EventTarget,
        event: string,
        callback: (event: E) => void,
    ): void;
}

/**
 * Types that can be parsed into a DomContext
 */
export type DomParsable = string | Element | DomContext;
