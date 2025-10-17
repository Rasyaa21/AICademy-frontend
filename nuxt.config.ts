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
      cookieDomain: process.env.NUXT_PUBLIC_COOKIE_DOMAIN || '',
    }
  },
  app: {
    head: {
      title: 'AICademy - Temukan Karir yang Kamu Banget',
      htmlAttrs: { lang: 'id' },
      link: [
        {
          rel: 'preload',
          as: 'style',
          href: '/_nuxt/entry.MZsD9sKh.css'
        },
        {
          rel: 'preload',
          as: 'style',
          href: '/_nuxt/index.BMdsvxCv.css'
        },
        {
          rel: 'icon',
          type: 'image/webp',
          href: 'https://aicademy.galleryne.my.id/assets/aicademy-logo.webp'
        },
        {
          rel: 'preconnect',
          href: 'https://aicademy.galleryne.my.id',
          crossorigin: ''
        },
        {
          rel: 'icon',
          type: 'image/webp',
          href: 'https://aicademy.galleryne.my.id/assets/aicademy-logo.webp'
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest'
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'AICademy membantu siswa dan alumni menemukan karir impian mereka dengan profiling keahlian, koneksi perusahaan, dan peluang magang di seluruh Indonesia.'
        },
        { name: 'author', content: 'AICademy Team' },
        { name: 'theme-color', content: '#dc2626' },
        { name: 'msapplication-TileColor', content: '#dc2626' }
      ],
      script: [
        {
          src: "https://cloud.umami.is/script.js",
          defer: true,
          "data-website-id": "582c19f3-1f1b-4f09-b6ab-54ad3ab1d1fc"
        }
      ]
    }
  },
  routeRules: {
    // Bundle build Nuxt
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    // File di folder /public (mis. /assets/*.webp, /icons/*.svg, dll)
    '/assets/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    '/icons/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },

    // API jangan di-cache
    '/api/**': {
      headers: { 'cache-control': 'no-store' }
    },

    // HTML: revalidate setiap request
    '/**': {
      headers: { 'cache-control': 'public, max-age=0, must-revalidate' }
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
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
  provider: 'ipx',            
  quality: 80,
  format: ['webp', 'avif', 'png', 'jpg'],
  screens: {
    xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536,
  },
  domains: ['pub-05d8cb1ce8b94b96a4835f0b0b556c1a.r2.dev'], 
  alias: {
    cdn: process.env.NUXT_PUBLIC_OBJECT_STORAGE_URL
      || 'https://aicademy.galleryne.my.id'
  },
}
})