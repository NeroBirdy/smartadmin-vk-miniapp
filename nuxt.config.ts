import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  app: {
    baseURL: "/smartadmin-vk-miniapp/",
    buildAssetsDir: "/_nuxt/",
  },

  nitro: {
    preset: "static",
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [svgLoader()],
  },
});
