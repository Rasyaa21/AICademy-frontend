export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Load auth state from cookies on app start
  authStore.loadFromCookies()
  
  // Setup auto token refresh if user is authenticated
  if (authStore.isLoggedIn) {
    console.log('User is authenticated, setting up token refresh')
    const { setupTokenRefresh } = useAuth()
    // Small delay to ensure everything is loaded
    nextTick(() => {
      setupTokenRefresh()
    })
  } else {
    console.log('User not authenticated, skipping token refresh setup')
  }
})