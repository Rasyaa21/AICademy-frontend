export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  let refreshTimer: NodeJS.Timeout | null = null

  // Clear existing timer
  const clearRefreshTimer = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }

  // Auto refresh token when it's about to expire
  const setupTokenRefresh = () => {
    // Clear any existing timer first
    clearRefreshTimer()
    
    if (!authStore.access_token) {
      console.log('No access token, skipping refresh setup')
      return
    }

    // Decode JWT to get expiration time
    try {
      const tokenPayload = JSON.parse(atob(authStore.access_token.split('.')[1]))
      const expirationTime = tokenPayload.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      const timeUntilExpiry = expirationTime - currentTime
      
      console.log('Token expires in:', Math.floor(timeUntilExpiry / 1000), 'seconds')
      
      // Refresh token 2 minutes before expiry, but minimum 30 seconds from now
      const refreshTime = Math.max(timeUntilExpiry - (2 * 60 * 1000), 30 * 1000)
      
      if (refreshTime > 0 && timeUntilExpiry > 0) {
        console.log('Setting up token refresh in:', Math.floor(refreshTime / 1000), 'seconds')
        
        refreshTimer = setTimeout(async () => {
          try {
            console.log('Auto-refreshing token...')
            await authStore.refreshAccessToken()
            setupTokenRefresh() // Setup next refresh
          } catch (error) {
            console.error('Auto token refresh failed:', error)
            // Redirect to login if refresh fails
            await logout()
          }
        }, refreshTime)
      } else {
        console.log('Token expired or expires too soon, attempting immediate refresh')
        // Token already expired or expires very soon, try to refresh immediately
        if (authStore.refresh_token) {
          authStore.refreshAccessToken().catch(async (error) => {
            console.error('Immediate token refresh failed:', error)
            await logout()
          })
        }
      }
    } catch (error) {
      console.error('Error parsing token:', error)
    }
  }

  // Manual refresh function
  const refreshToken = async () => {
    try {
      console.log('Manual token refresh requested')
      await authStore.refreshAccessToken()
      setupTokenRefresh() // Setup next refresh
      return true
    } catch (error) {
      console.error('Manual token refresh failed:', error)
      await logout()
      return false
    }
  }

  const logout = async () => {
    clearRefreshTimer()
    
    try {
      console.log('Attempting logout...')
      // Optional: Call logout endpoint
      await $fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': authStore.access_token ? `Bearer ${authStore.access_token}` : ''
        },
        baseURL: useRuntimeConfig().public.apiBase
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      authStore.logout()
      await router.push('/login')
    }
  }

  return {
    authStore,
    setupTokenRefresh,
    clearRefreshTimer,
    refreshToken,
    logout,
    isAuthenticated: computed(() => authStore.isLoggedIn),
    user: computed(() => authStore.user),
    userRole: computed(() => authStore.userRole)
  }
}