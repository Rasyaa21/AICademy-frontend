import { getCookieConfig } from '~/utils/cookie-config'

// middleware/00.auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (!import.meta.client) return

  const rawPath = to.path
  const cleanPath = (rawPath.replace(/\/+$/, '') || '/')
  const RESET_PATH = '/reset-default-user-password'
  const isResetRoute = cleanPath === RESET_PATH || cleanPath.endsWith(RESET_PATH)

  const authStore = useAuthStore()
  await authStore.loadFromCookies()

  // Pakai config cookie runtime (bukan hardcode)
  const cookieConfig = getCookieConfig()
  const tokenRef = useCookie<string | null>('token', { ...cookieConfig, default: () => null })
  const roleRef = useCookie<string | null>('role', { ...cookieConfig, default: () => null })
  const requirePasswordChangeRef = useCookie<boolean>('requirePasswordChange', { ...cookieConfig, default: () => false })

  let hasToken = !!(authStore.access_token || tokenRef.value)
  let role = authStore.userRole || roleRef.value || null
  const requirePasswordChange = authStore.requirePasswordChange || requirePasswordChangeRef.value

  // Fallback terakhir: validasi via /auth/me (cookie domain API akan dikirim otomatis)
  if (!hasToken) {
    try {
      const { $api } = useNuxtApp()
      const me: any = await $api('/auth/me', { method: 'GET' })
      if (me?.success) {
        hasToken = true
        role = me?.data?.role || me?.user?.role || role
      }
    } catch {}
  }

  if (isResetRoute) {
    if (!hasToken) return navigateTo('/login')
    return
  }

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

  if (!hasToken || !role) {
    return navigateTo('/login')
  }

  if (requirePasswordChange) return navigateTo(RESET_PATH)

  try {
    const isExpired = typeof authStore.getIsTokenExpired === 'function'
      ? authStore.getIsTokenExpired()
      : !!authStore.getIsTokenExpired
    if (isExpired) {
      authStore.refreshAccessToken().catch(() => navigateTo('/login'))
    }
  } catch {}

  if (cleanPath === '/dashboard') return navigateTo(roleToDashboard(role))
  const rolePermissions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/teacher': ['teacher', 'admin'],
    '/student': ['student', 'admin', 'alumni'],
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
    alumni: '/student/dashboard',
    student: '/student/dashboard',
  }
  return dashboards[role] || '/student/dashboard'
}