import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: [join(currentDir, "./app/assets/css/main.css")],
	modules: ["@nuxt/ui", "@nuxtjs/mdc"],

	// https://shiki.matsu.io/
	mdc: {
		highlight: {
			theme: "dark-plus",
			langs: ["html", "markdown", "vue", "typescript", "javascript"],
		},
	},
});
