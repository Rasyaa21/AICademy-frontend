import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  role: string
  name: string
}

interface AuthState {
  access_token: string | null
  refresh_token: string | null
  user: User | null
  isAuthenticated: boolean
}

interface RefreshResponse {
  success: boolean
  data: {
    access_token: string
    token_type: 'Bearer'
    expires_in: number // seconds
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    access_token: null,
    refresh_token: null,
    user: null,
    isAuthenticated: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.access_token && state.isAuthenticated,
    userRole: (state) => state.user?.role || null,
    userName: (state) => state.user?.name || null,
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    setTokens(access: string, refresh: string, user: User) {
      const isProd = !import.meta.dev

      this.access_token = access
      this.refresh_token = refresh
      this.user = user
      this.isAuthenticated = true

      useCookie<string | null>('access_token', { 
        maxAge: 15 * 60, secure: isProd, sameSite: 'strict' 
      }).value = access

      useCookie<string | null>('refresh_token', { 
        maxAge: 60 * 60 * 24 * 30, secure: isProd, sameSite: 'strict' 
      }).value = refresh

      useCookie<string | null>('role', { 
        maxAge: 60 * 60 * 24 * 30, secure: isProd, sameSite: 'strict' 
      }).value = user.role

      useCookie<User | null>('user', { 
        maxAge: 60 * 60 * 24 * 30, secure: isProd, sameSite: 'strict' 
      }).value = user
    },

    loadFromCookies() {
      const accessCookie = useCookie<string | null>('access_token')
      const refreshCookie = useCookie<string | null>('refresh_token')
      const userCookie = useCookie<User | null>('user')
      
      this.access_token = accessCookie.value || null
      this.refresh_token = refreshCookie.value || null
      this.user = userCookie.value || null
      this.isAuthenticated = !!(this.access_token && this.user)
    },

    async refreshAccessToken() {
      const config = useRuntimeConfig()
      const isProd = !import.meta.dev

      const refreshToken = this.refresh_token ?? useCookie<string | null>('refresh_token').value
      if (!refreshToken) return false

      try {
        const res = await $fetch<RefreshResponse>('/auth/refresh', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: { refresh_token: refreshToken },
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })

        if (res?.success && res?.data?.access_token) {
          this.access_token = res.data.access_token
          this.isAuthenticated = !!(this.access_token && (this.user ?? useCookie<User | null>('user').value))

          // set ulang access_token cookie dengan maxAge baru (default 15 menit kalau tidak dikirim)
          const maxAge = res.data.expires_in ?? 15 * 60
          useCookie<string | null>('access_token', { 
            maxAge, secure: isProd, sameSite: 'strict' 
          }).value = res.data.access_token

          return true
        }
        return false
      } catch (e) {
        console.error('Failed to refresh access token:', e)
        // Jangan langsung logout; biarkan UI handle jika perlu
        return false
      }
    },

    logout() {
      const isProd = !import.meta.dev
      useCookie<string | null>('access_token', { secure: isProd, sameSite: 'strict' }).value = null
      useCookie<string | null>('refresh_token', { secure: isProd, sameSite: 'strict' }).value = null
      useCookie<User | null>('user', { secure: isProd, sameSite: 'strict' }).value = null
      this.clear()
    },

    clear() {
      this.access_token = null
      this.refresh_token = null
      this.user = null
      this.isAuthenticated = false
    }
  }
})