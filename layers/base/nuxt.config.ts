// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["./layers/base/app/assets/css/main.css"],
	modules: ["@nuxt/ui", "@nuxtjs/mdc"],

	// https://shiki.matsu.io/
	mdc: {
		highlight: {
			theme: "dark-plus",
			langs: ["html", "markdown", "vue", "typescript", "javascript"],
		},
	},
});
