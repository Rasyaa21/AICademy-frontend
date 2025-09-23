export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
        onRequest({ options }) {
            const token = useCookie<string | null>('token').value
            options.headers = new Headers(options.headers || {})
            options.headers.set('Content-Type', 'application/json')
            if (token) options.headers.set('Authorization', `Bearer ${token}`)
        }
    })

    return {provide: {api}}
})