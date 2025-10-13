export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
        onRequest({ options }) {
            const accessToken = useCookie<string | null>('access_token').value
            options.headers = new Headers(options.headers || {})
            options.headers.set('Content-Type', 'application/json')
            if (accessToken) {
                options.headers.set('Authorization', `Bearer ${accessToken}`)
            }
        },
        async onResponseError({ response }) {
            // If we get 401 Unauthorized, try to refresh token
            if (response.status === 401) {
                const authStore = useAuthStore()
                const { refreshToken } = useAuth()
                
                console.log('Got 401 error, attempting token refresh')
                
                // Try to refresh token if we have a refresh token
                if (authStore.refresh_token) {
                    try {
                        await refreshToken()
                        console.log('Token refreshed successfully after 401')
                    } catch (error) {
                        console.error('Failed to refresh token after 401:', error)
                        // Don't return anything, just log the error
                    }
                }
            }
        }
    })

    return { provide: { api } }
})