import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  role: string
  name?: string
}

interface AuthState {
  access_token: string | null
  refresh_token: string | null
  user: User | null
  userRole: string | null
  requirePasswordChange: boolean
  isLoggedIn: boolean
  isTokenExpired: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    access_token: null,
    refresh_token: null,
    user: null,
    userRole: null,
    requirePasswordChange: false,
    isLoggedIn: false,
    isTokenExpired: false,
  }),

  getters: {
    getIsLoggedIn: (state) => !!state.access_token && !!state.userRole,
    getIsTokenExpired: (state) => {
      if (!state.access_token) return false
      try {
        const payload = JSON.parse(atob(state.access_token.split('.')[1] ?? ''))
        return Date.now() >= payload.exp * 1000
      } catch {
        return false
      }
    },
  },

  actions: {
    loadFromCookies() {
      if (import.meta.server) return

      const accessTokenCookie = useCookie<string | null>('access_token', {
        default: () => null,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      const tokenCookie = useCookie<string | null>('token', {
        default: () => null,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      const roleCookie = useCookie<string | null>('role', {
        default: () => null,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      const userCookie = useCookie<User | null>('user', {
        default: () => null,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      const requirePasswordChangeCookie = useCookie<boolean>('requirePasswordChange', {
        default: () => false,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })
      const refreshTokenCookie = useCookie<string | null>('refresh_token', {
        default: () => null,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      })

      this.access_token = accessTokenCookie.value || tokenCookie.value
      this.refresh_token = refreshTokenCookie.value
      this.userRole = roleCookie.value
      this.user = userCookie.value
      this.requirePasswordChange = requirePasswordChangeCookie.value

      this.isLoggedIn = !!this.access_token && !!this.userRole
      this.isTokenExpired = this.getIsTokenExpired
    },

    async refreshAccessToken() {
      try {
        const apiBase = useRuntimeConfig().public.apiBase

        const body =
          this.refresh_token && this.refresh_token.length > 0
            ? { refresh_token: this.refresh_token }
            : undefined

        const response = (await $fetch(apiBase + '/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body,
        })) as {
          success: boolean
          data?: { access_token: string; token_type: string; expires_in: number }
        }

        if (response?.success && response?.data?.access_token) {
          this.access_token = response.data.access_token

          const accessTokenCookie = useCookie<string>('access_token', {
            secure: true,
            sameSite: 'none',
          })
          const tokenCookie = useCookie<string>('token', {
            secure: true,
            sameSite: 'none',
          })
          accessTokenCookie.value = response.data.access_token
          tokenCookie.value = response.data.access_token

          this.isTokenExpired = false
          this.isLoggedIn = !!this.access_token && !!this.userRole
          return response.data.access_token
        }
        throw new Error('Invalid refresh response')
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.access_token = null
      this.refresh_token = null
      this.user = null
      this.userRole = null
      this.requirePasswordChange = false
      this.isLoggedIn = false
      this.isTokenExpired = false

      if (import.meta.client) {
        const accessTokenCookie = useCookie<string | null>('access_token', { secure: true, sameSite: 'none' })
        const tokenCookie = useCookie<string | null>('token', { secure: true, sameSite: 'none' })
        const roleCookie = useCookie<string | null>('role', { secure: true, sameSite: 'none' })
        const userCookie = useCookie<User | null>('user', { secure: true, sameSite: 'none' })
        const requirePasswordChangeCookie = useCookie<boolean>('requirePasswordChange', { secure: true, sameSite: 'none' })
        const refreshTokenCookie = useCookie<string | null>('refresh_token', { secure: true, sameSite: 'none' })
        
        accessTokenCookie.value = null
        tokenCookie.value = null
        roleCookie.value = null
        userCookie.value = null
        requirePasswordChangeCookie.value = false
        refreshTokenCookie.value = null
      }
    },

    setAuthData(accessToken: string, refreshToken: string | null, user: User, requirePasswordChange: boolean = false) {
      this.access_token = accessToken
      this.refresh_token = refreshToken ?? null
      this.user = user
      this.userRole = user.role
      this.requirePasswordChange = requirePasswordChange
      this.isLoggedIn = true
      this.isTokenExpired = false

      if (import.meta.client) {
        const accessTokenCookie = useCookie<string>('access_token', { secure: true, sameSite: 'none' })
        const tokenCookie = useCookie<string>('token', { secure: true, sameSite: 'none' })
        const roleCookie = useCookie<string>('role', { secure: true, sameSite: 'none' })
        const userCookie = useCookie<User>('user', { secure: true, sameSite: 'none' })
        const requirePasswordChangeCookie = useCookie<boolean>('requirePasswordChange', { secure: true, sameSite: 'none' })
        const refreshTokenCookie = useCookie<string | null>('refresh_token', { secure: true, sameSite: 'none' })
        
        accessTokenCookie.value = accessToken
        tokenCookie.value = accessToken
        roleCookie.value = user.role
        userCookie.value = user
        requirePasswordChangeCookie.value = requirePasswordChange
        refreshTokenCookie.value = refreshToken ?? null
      }
    },

    clearPasswordChangeRequirement() {
      this.requirePasswordChange = false
      
      if (import.meta.client) {
        const requirePasswordChangeCookie = useCookie<boolean>('requirePasswordChange', { secure: true, sameSite: 'none' })
        requirePasswordChangeCookie.value = false
      }
    },
  },
})