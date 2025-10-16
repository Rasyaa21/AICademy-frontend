export const debugCookies = () => {
  if (import.meta.client) {
    console.log('=== Cookie Debug ===')
    console.log('All cookies:', document.cookie)
    console.log('Location:', window.location.href)
    console.log('Secure context:', window.isSecureContext)
    console.log('Environment:', process.env.NODE_ENV)
    
    // Test setting a simple cookie
    document.cookie = 'test=value; path=/; SameSite=Lax'
    console.log('Test cookie set, check if it appears in document.cookie')
  }
}