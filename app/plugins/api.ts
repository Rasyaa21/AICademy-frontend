export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      const accessTokenCookie = useCookie<string | null>('access_token', { secure: true, sameSite: 'none' })
      const tokenCookie = useCookie<string | null>('token', { secure: true, sameSite: 'none' })
      const accessToken = accessTokenCookie.value || tokenCookie.value

      if (!options.headers) {
        options.headers = {}
      }
      
      // Convert headers to object if it's not already
      const headers = options.headers as Record<string, string>
      headers['Content-Type'] = 'application/json'
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
      }
    },
    async onResponseError({ response, request }) {
      if (response.status === 401) {
        const authStore = useAuthStore()
        try {
          await authStore.refreshAccessToken()
          const newToken = authStore.access_token
          if (newToken) {
            // Create new request with updated token
            const newHeaders = { ...request.headers as Record<string, string> }
            newHeaders['Authorization'] = `Bearer ${newToken}`
            
            return $fetch(request.url, { 
              method: request.method,
              body: request.body,
              headers: newHeaders, 
              credentials: 'include' 
            })
          }
        } catch {
          authStore.logout()
          await navigateTo('/login')
        }
      }
    },
  })

  return { provide: { api } }
})