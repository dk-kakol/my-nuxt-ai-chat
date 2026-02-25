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
					// driver: 'netlify-blobs',
					// poniższe jest dla vercela, ale jest problem z opją allowOverwrite
					driver: "vercel-blob",
					access: "public",
					token: process.env.BLOB_READ_WRITE_TOKEN,
					allowOverwrite: true,
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
