export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  let refreshTimer: NodeJS.Timeout | null = null

  const clearRefreshTimer = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }

  const setupTokenRefresh = () => {
    clearRefreshTimer()
    if (!authStore.access_token) return

    try {
      const parts = authStore.access_token.split('.')
      const payloadPart = parts[1]
      if (!payloadPart) return

      const tokenPayload = JSON.parse(atob(payloadPart))
      const expirationTime = tokenPayload.exp * 1000 as number
      const currentTime = Date.now()
      const timeUntilExpiry = expirationTime - currentTime

      const refreshTime = Math.max(timeUntilExpiry - 2 * 60 * 1000, 30 * 1000)

      if (refreshTime > 0 && timeUntilExpiry > 0) {
        refreshTimer = setTimeout(async () => {
          try {
            await authStore.refreshAccessToken()
            setupTokenRefresh()
          } catch {
            await logout()
          }
        }, refreshTime)
      } else {
        authStore.refreshAccessToken().catch(async () => {
          await logout()
        })
      }
    } catch {
      // Handle parsing error silently
    }
  }

  const logout = async () => {
    clearRefreshTimer()
    try {
      await $fetch(useRuntimeConfig().public.apiBase + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: authStore.access_token ? `Bearer ${authStore.access_token}` : '' },
      })
    } catch {
      // Handle error silently
    }
    finally {
      authStore.logout()
      await router.push('/login')
    }
  }

  return {
    authStore,
    setupTokenRefresh,
    clearRefreshTimer,
    logout,
    isAuthenticated: computed(() => authStore.isLoggedIn),
    user: computed(() => authStore.user),
    userRole: computed(() => authStore.userRole),
  }
}