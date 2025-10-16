import { getCookieConfig } from '~/utils/cookie-config'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      // Optional: inject Authorization jika FE punya token sendiri
      // Tidak wajib untuk cross-domain cookie flow
      options.headers = { ...(options.headers as any), 'Content-Type': 'application/json' }
    },
  })

  return { provide: { api } }
})