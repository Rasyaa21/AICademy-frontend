// https://nuxt.com/docs/api/configuration/nuxt-config
import 'pinia-plugin-persistedstate'
export default defineNuxtConfig({
  pinia: {
    autoImports: ['defineStore']
  },
  pages: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxt-marquee',
    'nuxt-marquee',
    'motion-v/nuxt',
    '@nuxt/icon',
    '@samk-dev/nuxt-vcalendar',
    'nuxt-charts',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/image',
  ], 
  googleFonts: {
    families: {
      "Plus+Jakarta+Sans": [200,300,400,500,600,700,800], 
    },
    display: "swap",
    preconnect: true,
  },
  image: {
    quality: 80,
    format: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  }
})