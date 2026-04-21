// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev','.loca.lt', 'loca.lt', 'mean-radios-invite.loca.lt']
    },
  },
  ssr: false,
})
