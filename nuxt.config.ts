// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxt-marquee',
    'nuxt-marquee'
  ], 
  googleFonts: {
    families: {
      "Plus+Jakarta+Sans": [200,300,400,500,600,700,800], 
    },
    display: "swap",
    preconnect: true,
  },
})