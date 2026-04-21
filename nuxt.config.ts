import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  app: {
    baseURL: "/smartadmin-vk-miniapp/", // замените на имя вашего репозитория!
    buildAssetsDir: "assets/", // меняем _nuxt на assets, чтобы избежать проблем с Jekyll
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