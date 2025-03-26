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
 *     template(): Element {
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

    constructor(shadowMode: ShadowRootMode = "open") {
        super();

        const construct = this.constructor as typeof DomElement;

        this.shadowRoot = this.attachShadow({ mode: shadowMode });

        if (construct.css) {
            const style = document.createElement("style");
            style.textContent = construct.css;
            this.shadowRoot.appendChild(style);
        }

        this.shadowRoot.appendChild(dom(this.template()).clone().element);
    }
}
