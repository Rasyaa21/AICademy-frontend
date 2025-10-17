import { getCookieConfig } from '~/utils/cookie-config'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (!import.meta.client) return

  const rawPath = to.path
  const cleanPath = (rawPath.replace(/\/+$/, '') || '/')
  const RESET_PATH = '/reset-default-user-password'
  const isResetRoute = cleanPath === RESET_PATH || cleanPath.endsWith(RESET_PATH)

  // Load cookies dengan config yang konsisten
  const cookieConfig = getCookieConfig()
  const tokenRef = useCookie<string | null>('token', cookieConfig)
  const accessTokenRef = useCookie<string | null>('access_token', cookieConfig)
  const roleRef = useCookie<string | null>('role', cookieConfig)
  const requirePasswordChangeRef = useCookie<string | null>('requirePasswordChange', cookieConfig)

  // Priority: access_token > token (untuk backward compatibility)
  let hasToken = !!(accessTokenRef.value || tokenRef.value)
  let role = roleRef.value || null
  const requirePasswordChange = requirePasswordChangeRef.value === 'true'

  if (!hasToken) {
    try {
      const { $api } = useNuxtApp()
      const me: any = await $api('/auth/me', { 
        method: 'GET',
        credentials: 'include'
      })
      
      if (me?.success && me?.data) {
        hasToken = true
        role = me.data.role
        
        // Update auth store jika ada
        const authStore = useAuthStore()
        authStore.setAuthData(
          me.data.access_token || 'from_cookie',
          null,
          {
            id: me.data.id || me.data.user_id,
            email: me.data.email,
            role: me.data.role,
            name: me.data.name || me.data.fullname
          },
          me.data.require_password_change || false
        )
      }
    } catch (error) {
      hasToken = false
      role = null
    }
  }

  // Handle reset password route
  if (isResetRoute) {
    if (!hasToken) return navigateTo('/login')
    return
  }

  // Define public routes
  const publicRoutes = new Set([
    '/', '/login', '/register', '/forgot-password',
    '/reset-password', '/email-verification',
    '/teacher-login', '/company-login', '/admin-login'
  ])
  const publicPrefixes = ['/profile/']
  const isPublicRoute = publicRoutes.has(cleanPath) || publicPrefixes.some(p => cleanPath.startsWith(p))

  if (isPublicRoute) {
    const isAuthLanding = ['/login','/register','/teacher-login','/company-login','/admin-login'].includes(cleanPath)
    if (isAuthLanding && hasToken && role) {
      if (requirePasswordChange) return navigateTo(RESET_PATH)
      return navigateTo(roleToDashboard(role))
    }
    return
  }

  // Check authentication
  if (!hasToken || !role) {
    return navigateTo('/login')
  }

  if (requirePasswordChange) return navigateTo(RESET_PATH)

  // Handle dashboard redirect
  if (cleanPath === '/dashboard') return navigateTo(roleToDashboard(role))
  
  // Check role permissions
  const rolePermissions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/teacher': ['teacher', 'admin'],
    '/student': ['student', 'admin'],
    '/company': ['company', 'admin'],
  }
  
  for (const [prefix, allowed] of Object.entries(rolePermissions)) {
    if (cleanPath.startsWith(prefix + '/') && !allowed.includes(role!)) {
      return navigateTo(roleToDashboard(role!))
    }
  }
})

function roleToDashboard(role: string): string {
  const dashboards: Record<string, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    company: '/company/dashboard',
    student: '/student/dashboard',
  }
  return dashboards[role] || '/student/dashboard'
}