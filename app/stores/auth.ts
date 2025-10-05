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
      // Set store state
      this.access_token = access
      this.refresh_token = refresh
      this.user = user
      this.isAuthenticated = true

      // Set cookies
      const accessCookie = useCookie<string | null>('access_token', { 
        maxAge: 15 * 60, // 15 minutes
        secure: true,
        sameSite: 'strict'
      })
      const refreshCookie = useCookie<string | null>('refresh_token', { 
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: true,
        sameSite: 'strict'
      })
      const roleCookie = useCookie<string | null>('role', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: true,
        sameSite: 'strict'
      })
      const userCookie = useCookie<User | null>('user', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: true,
        sameSite: 'strict'
      })

      accessCookie.value = access
      refreshCookie.value = refresh
      roleCookie.value = user.role
      userCookie.value = user

      console.log('Tokens set successfully:', { access: !!access, refresh: !!refresh, user: user.name })
    },

    loadFromCookies() {
      const accessCookie = useCookie<string | null>('access_token')
      const refreshCookie = useCookie<string | null>('refresh_token')
      const userCookie = useCookie<User | null>('user')
      
      this.access_token = accessCookie.value || null
      this.refresh_token = refreshCookie.value || null
      this.user = userCookie.value || null
      this.isAuthenticated = !!(this.access_token && this.user)

      console.log('Loaded from cookies:', {
        hasAccess: !!this.access_token,
        hasRefresh: !!this.refresh_token,
        hasUser: !!this.user,
        isAuth: this.isAuthenticated
      })
    },

    async refreshAccessToken() {
      const config = useRuntimeConfig()
      
      console.log('Attempting to refresh token...')
      console.log('Current refresh token:', !!this.refresh_token)
      
      if (!this.refresh_token) {
        console.error('No refresh token available')
        throw new Error('No refresh token available')
      }

      try {
        console.log('Making refresh token request...')
        const response = await $fetch('/auth/refresh', {
          method: 'POST',
          body: {
            refresh_token: this.refresh_token
          },
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          baseURL: config.public.apiBase
        })

        console.log('Refresh token response:', response)

        if (response.success && response.data) {
          const { access_token, refresh_token, user } = response.data
          
          // Update tokens with new access token and refresh token
          this.setTokens(
            access_token,
            refresh_token || this.refresh_token, // Use new refresh token if provided
            user || this.user! // Use new user data if provided, otherwise keep existing
          )
          
          console.log('Token refreshed successfully')
          return access_token
        } else {
          throw new Error(response?.message || 'Failed to refresh token')
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
        throw error
      }
    },

    logout() {
      console.log('Logging out...')
      
      // Clear store state
      this.access_token = null
      this.refresh_token = null
      this.user = null
      this.isAuthenticated = false

      // Clear cookies
      const accessCookie = useCookie('access_token')
      const refreshCookie = useCookie('refresh_token')
      const roleCookie = useCookie('role')
      const userCookie = useCookie('user')

      accessCookie.value = null
      refreshCookie.value = null
      roleCookie.value = null
      userCookie.value = null
    },

    clear() {
      this.logout()
    }
  }
})