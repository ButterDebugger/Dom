import { launch } from "@astral/astral";
import { assertEquals } from "@std/assert";

Deno.test("title", async () => {
    // Launch the browser and open a new page
    const browser = await launch({
        headless: true,
    });
    const page = await browser.newPage("http://localhost:7000/");

    // Get the title
    const value = await page.evaluate(async () => {
        // Import module
        // @ts-ignore: Types are assignable
        const { dom }: typeof import("../src/index.ts") = await import(
            "../dist/index.js"
        );

        // Execute module functions
        return dom("title")?.text();
    });

    // Close the browser
    await browser.close();

    // Check the result
    assertEquals(value, "Browser Tests");
});
