import { dom } from "./context.ts";
import type { DomParsable } from "./types.ts";

/**
 * Defines a custom element using the given class that extends DomElement
 * @param element The custom element class to define
 */
export function component<
    T extends CustomElementConstructor & typeof DomElement,
>(element: T): void {
    // Make sure the class has the static 'tagName' property defined
    if (!element.tagName) {
        throw new Error(
            element.name === ""
                ? `An anonymous custom element class is missing the static 'tagName' property.`
                : `The custom element class '${element.name}' is missing the static 'tagName' property.`,
        );
    }

    // Register the custom element
    customElements.define(element.tagName, element);
}

/**
 * Base class for creating custom elements
 *
 * # Example
 * ```ts
 * class WelcomeBox extends DomElement {
 *     static override tagName = "welcome-box";
 *     static override css = css`
 *         div {
 *             background-color: skyblue;
 *         }
 *     `;
 *
 *     template(): DomParsable {
 *         return html`
 *             <div>
 *                 <h1>Hello there!</h1>
 *                 <slot></slot>
 *             </div>
 *         `;
 *     }
 * }
 *
 * component(WelcomeBox);
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
 */
export abstract class DomElement extends HTMLElement {
    /** The tag name of the custom element */
    static tagName: string;
    /** The CSS to apply to the custom element */
    static css: string | undefined;

    /** The template to use for the custom element */
    abstract template(): DomParsable;

    override shadowRoot: ShadowRoot;

    private _mountEffects: (() => void)[] = [];
    private _unmountEffects: (() => void)[] = [];
    private _adoptEffects: (() => void)[] = [];
    private _changeEffects: Record<string, ChangeCallback[]> = {};

    constructor(shadowOptions: ShadowRootInit = { mode: "open" }) {
        super();

        const construct = this.constructor as typeof DomElement;

        this.shadowRoot = this.attachShadow(shadowOptions);

        if (construct.css) {
            const style = document.createElement("style");
            style.textContent = construct.css;
            this.shadowRoot.appendChild(style);
        }

        this.shadowRoot.appendChild(dom(this.template()).element);
    }

    /**
     * Adds a callback to be called when the element is added to the page
     *
     * # Example
     * ```ts
     * this.mountEffect(() => {
     *     console.log("mounted");
     * });
     * ```
     *
     * @param callback A function that will be called when the event occurs
     */
    protected mountEffect(callback: () => void): void {
        this._mountEffects.push(callback);
    }

    /**
     * Adds a callback to be called when the element is removed from the page
     *
     * # Example
     * ```ts
     * this.unmountEffect(() => {
     *     console.log("unmounted");
     * });
     * ```
     *
     * @param callback A function that will be called when the event occurs
     */
    protected unmountEffect(callback: () => void): void {
        this._unmountEffects.push(callback);
    }

    /**
     * Adds a callback to be called when the element is moved to a new page
     *
     * # Example
     * ```ts
     * this.adoptEffect(() => {
     *     console.log("adopted");
     * });
     * ```
     *
     * @param callback A function that will be called when the event occurs
     */
    protected adoptEffect(callback: () => void): void {
        this._adoptEffects.push(callback);
    }

    /**
     * Adds a callback to be called when the given observed attribute has changed
     *
     * # Example
     * ```ts
     * this.changeEffect("name", ({ oldValue, newValue }) => {
     *     console.log("'name' changed from", oldValue, "to", newValue);
     * });
     * ```
     *
     * @param name The name of the attribute
     * @param callback A function that will be called when the event occurs
     */
    protected changeEffect(name: string, callback: ChangeCallback): void {
        const lowerName = name.toLowerCase();

        if (!this._changeEffects[lowerName]) {
            this._changeEffects[lowerName] = [];
        }
        this._changeEffects[lowerName].push(callback);
    }

    /**
     * Custom element added to page
     *
     * Use `mountEffect` instead to add handlers for this event
     */
    connectedCallback(): void {
        for (let i = 0; i < this._mountEffects.length; i++) {
            this._mountEffects[i]();
        }
    }

    /**
     * Custom element removed from page
     *
     * Use `unmountEffect` instead to add handlers for this event
     */
    disconnectedCallback(): void {
        for (let i = 0; i < this._unmountEffects.length; i++) {
            this._unmountEffects[i]();
        }
    }

    /**
     * Custom element moved to new page
     *
     * Use `adoptEffect` instead to add handlers for this event
     */
    adoptedCallback(): void {
        for (let i = 0; i < this._adoptEffects.length; i++) {
            this._adoptEffects[i]();
        }
    }

    /**
     * An observed attribute has changed
     *
     * Use `changeEffect` instead to add handlers for this event
     * @param name The name of the changed attribute
     * @param oldValue The old value
     * @param newValue the new value
     */
    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ): void {
        const lowerName = name.toLowerCase();

        if (this._changeEffects[lowerName]) {
            for (let i = 0; i < this._changeEffects[lowerName].length; i++) {
                this._changeEffects[lowerName][i]({ oldValue, newValue });
            }
        }
    }
}

/**
 * The callback to be called when an observed attribute has changed
 */
export type ChangeCallback = (details: {
    oldValue: string | null;
    newValue: string | null;
}) => void;
