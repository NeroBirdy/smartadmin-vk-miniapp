// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/smartadmin-vk-miniapp/', // замените на имя вашего репозитория!
    buildAssetsDir: 'assets', // меняем _nuxt на assets, чтобы избежать проблем с Jekyll
  },

  ssr: false, // важно для статического сайта
  
  devtools: { enabled: true },
  
  // Убедитесь, что используется правильная директория для генерации
  nitro: {
    output: {
      dir: '.output',
      publicDir: '.output/public'
    }
  }
})