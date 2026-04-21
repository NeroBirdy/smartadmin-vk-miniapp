import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  app: {
    baseURL: "/smartadmin-vk-miniapp/",
    buildAssetsDir: "assets/", 
  },
  nitro: {
    output: {
      dir: ".output",
      publicDir: ".output/public",
    },
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [svgLoader()],
  },
});