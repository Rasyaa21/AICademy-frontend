export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.loadFromCookies()
  
  if (authStore.isLoggedIn) {
    const { setupTokenRefresh } = useAuth()
    nextTick(() => { 
      setupTokenRefresh() 
    })
  }
})