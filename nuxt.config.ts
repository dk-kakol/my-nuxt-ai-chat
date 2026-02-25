// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/image"],
	runtimeConfig: {
		openaiApiKey: "",
	},
	nitro: {
		storage: {
			db: {
				driver: "fs",
				base: "./.data",
			},
		},
	},

	// https://unstorage.unjs.io/drivers
	$production: {
		nitro: {
			storage: {
				db: {
					// driver: "netlify-blobs",
					driver: "vercel-blob",
					name: "my-nuxt-ai-chat-blob",
					access: "public",
				},
			},
		},
	},

	routeRules: {
		// nasz homepage może być prerenderowany, bo jest statyczny
		"/": { prerender: true },
		// jeśli chcielibyśmy wyłączyć domyślne SSR dla jakiś stron:
		// "chats/**": { ssr: false },
	},
});
