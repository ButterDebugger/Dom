import { basename, dirname, resolve } from "node:path";
import { glob } from "glob";
import { defineConfig } from "vite";
import { cwd } from "node:process";

export default defineConfig({
	build: {
		target: "es2022",
		outDir: resolve(cwd(), "dist"),
		rollupOptions: {
			input: (await glob("public/**/index.html")).reduce(
				(put: Record<string, string>, path: string) => {
					put[basename(dirname(path))] = path;
					return put;
				},
				{}
			)
		},
		sourcemap: true
	},
	publicDir: resolve(cwd(), "static"),
	root: resolve(cwd(), "public"),
	appType: "mpa",
	plugins: []
});
