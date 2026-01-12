// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/mdc"],
	runtimeConfig: {
		openaiApiKey: "",
	},

	// https://shiki.matsu.io/
	mdc: {
		highlight: {
			theme: "dark-plus",
			langs: ["html", "markdown", "vue", "typescript", "javascript"],
		},
	},
	// tutorial dodaje optymalizację zależności dla debug przy używaniu ai-sdk
	// ale tu wygląda, że wszystko działa w nowszych wersjach bez tego
	// vite: {
	// 	optimizeDeps: {
	// 		include: ["debug"],
	// 	},
	// },
});
