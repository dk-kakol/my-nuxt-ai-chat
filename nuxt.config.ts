// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint"],
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
					driver: "netlify-blobs",
					name: "db",
				},
			},
		},
	},
});
