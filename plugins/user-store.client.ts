export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  
  // Auto-fetch user data on app initialization if not already loaded
  if (!userStore.user && !userStore.isLoading) {
    await userStore.fetchUser()
  }
})