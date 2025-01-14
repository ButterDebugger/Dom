import { dom, type DomContext } from "./context.ts";
import type { DomParsable } from "./types.ts";
import { isContext, isHTML } from "./utils.ts";

export type ComponentRenderer = (
    ctx: DomContext,
    options: Record<string, unknown>,
) => DomContext;

/**
 * Statically defined dom components
 */
export class DomComponent {
    #selector: string;
    #template: string;
    #renderer: ComponentRenderer;
    #valid = false;

    constructor(
        selector: string,
        template: string,
        renderer: ComponentRenderer,
    ) {
        // Check variable types
        if (typeof selector !== "string") {
            throw new TypeError("Selector is invalid.");
        }

        if (typeof template !== "string" || !isHTML(template)) {
            throw new TypeError("Template is invalid.");
        }

        if (typeof renderer !== "function") {
            throw new TypeError("Renderer is invalid.");
        }

        // Set final variables
        this.#selector = selector;
        this.#template = template;
        this.#renderer = renderer;
        this.#valid = true;
    }

    get selector(): string {
        return this.#selector;
    }
    get template(): string {
        return this.#template;
    }
    get renderer(): ComponentRenderer {
        return this.#renderer;
    }

    create(
        options = {},
        slot: null | DomParsable | DomParsable[] | HTMLCollection = null,
    ): DomContext {
        if (!this.#valid) throw new Error("Malformed component.");

        // Create template element
        let $component = dom(this.#template);
        if ($component === null) {
            throw new Error("Failed to create component from template string.");
        }

        // Slot optional element into slot
        if (slot !== null) {
            const $slotEle = $component.find("slot", true);

            if ($slotEle !== null) {
                const children: DomContext[] = [];

                if (Array.isArray(slot) || slot instanceof HTMLCollection) {
                    for (const slotItem of slot) {
                        const $slotItem = dom(slotItem);
                        if ($slotItem === null) continue;

                        children.unshift($slotItem);
                    }
                } else {
                    const $slotItem = dom(slot);

                    if ($slotItem !== null) {
                        children.unshift($slotItem);
                    }
                }

                for (const $slotItem of children) {
                    $slotEle.after($slotItem);
                }
                $slotEle.remove();
            }
        } else {
            for (const $ele of $component.findAll("slot", true)) {
                $ele.remove();
            }
        }

        // Render the component and make sure it is a component
        $component = this.renderer($component, options);
        if (!isContext($component)) {
            throw new TypeError("Renderer failed to return a valid component.");
        }

        return $component;
    }
}

/**
 * Dom builder for creating components
 */
export class DomBuilder {
    #selector: string | null = null;
    #template: string | null = null;
    #renderer: ComponentRenderer | null = null;

    setSelector(value: string): DomBuilder {
        if (typeof value !== "string") {
            throw new TypeError("Selector must be a string.");
        }

        this.#selector = value;
        return this;
    }
    get selector(): string | null {
        return this.#selector;
    }

    setTemplate(value: string): DomBuilder {
        if (typeof value !== "string") {
            throw new TypeError("Template must be a string.");
        }
        if (!isHTML(value)) {
            throw new SyntaxError("Invalid template HTML string.");
        }

        this.#template = value;
        return this;
    }
    get template(): string | null {
        return this.#template;
    }

    setRenderer(value: ComponentRenderer): DomBuilder {
        if (typeof value !== "function") {
            throw new TypeError("Renderer must be a function.");
        }

        this.#renderer = value;
        return this;
    }
    get renderer(): ComponentRenderer | null {
        return this.#renderer;
    }

    build(): DomComponent {
        if (
            this.#selector === null ||
            this.#template === null ||
            this.#renderer === null
        ) {
            throw new Error("Builder is unfinished.");
        }

        // Return component class
        return new DomComponent(this.#selector, this.#template, this.#renderer);
    }
}

export function component(options: {
    selector?: string;
    template?: string;
    renderer?: ComponentRenderer;
}): DomBuilder {
    const builder = new DomBuilder();

    if (options?.selector) builder.setSelector(options.selector);
    if (options?.template) builder.setTemplate(options.template);
    if (options?.renderer) {
        builder.setRenderer(options.renderer);
    } else {
        builder.setRenderer((ctx) => ctx);
    }

    return builder;
}
