// middleware/00.auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (!import.meta.client) return

  const rawPath = to.path
  const cleanPath = (rawPath.replace(/\/+$/, '') || '/')
  const RESET_PATH = '/reset-default-user-password'

  const isResetRoute = cleanPath === RESET_PATH || cleanPath.endsWith(RESET_PATH)

  const authStore = useAuthStore()
  authStore.loadFromCookies()

  const tokenRef = useCookie<string | null>('token', { default: () => null, secure: true, sameSite: 'lax' })
  const roleRef = useCookie<string | null>('role', { default: () => null, secure: true, sameSite: 'lax' })
  const requirePasswordChangeRef = useCookie<boolean>('requirePasswordChange', { default: () => false, secure: true, sameSite: 'lax' })

  const hasToken = !!(authStore.access_token || tokenRef.value)
  const role = authStore.userRole || roleRef.value
  const requirePasswordChange = authStore.requirePasswordChange || requirePasswordChangeRef.value

  // 1) Hard-allow halaman reset
  if (isResetRoute) {
    if (!hasToken) return navigateTo('/login')
    return
  }

  // 2) Daftar rute publik (exact match)
  const publicRoutes = new Set([
    '/', '/login', '/register', '/forgot-password',
    '/reset-password', '/email-verification',
    '/teacher-login', '/company-login', '/admin-login'
  ])

  // 3) Prefix publik untuk rute dinamis
  const publicPrefixes = ['/profile/'] // tambahkan lagi kalau perlu, mis: '/jobs/', '/posts/'
  
  // 4) Final penentu "public"
  const isPublicRoute = publicRoutes.has(cleanPath) || publicPrefixes.some(p => cleanPath.startsWith(p))

  // 5) Kalau rute publik
  if (isPublicRoute) {
    // Kalau sudah login & masuk ke halaman login/registrasi, lempar ke dashboard/force reset
    const isAuthLanding =
      cleanPath === '/login' ||
      cleanPath === '/register' ||
      cleanPath === '/teacher-login' ||
      cleanPath === '/company-login' ||
      cleanPath === '/admin-login'

    if (isAuthLanding && hasToken && role) {
      if (requirePasswordChange) return navigateTo(RESET_PATH)
      return navigateTo(roleToDashboard(role))
    }

    // Selain itu, biarkan lewat
    return
  }

  // 6) Protected routes
  if (!hasToken || !role) {
    return navigateTo('/login')
  }

  // 7) Paksa reset kalau diminta
  if (requirePasswordChange) {
    return navigateTo(RESET_PATH)
  }

  // 8) Refresh token check (best-effort)
  try {
    const isExpired = typeof authStore.getIsTokenExpired === 'function'
      ? authStore.getIsTokenExpired()
      : !!authStore.getIsTokenExpired
    if (isExpired) {
      authStore.refreshAccessToken().catch(() => navigateTo('/login'))
    }
  } catch {}

  // 9) /dashboard -> dashboard sesuai role
  if (cleanPath === '/dashboard') {
    return navigateTo(roleToDashboard(role))
  }

  // 10) Role-based prefix guard
  const rolePermissions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/teacher': ['teacher', 'admin'],
    '/student': ['student', 'admin', 'alumni'],
    '/company': ['company', 'admin'],
  }

  for (const [prefix, allowed] of Object.entries(rolePermissions)) {
    if (cleanPath.startsWith(prefix + '/') && !allowed.includes(role)) {
      return navigateTo(roleToDashboard(role))
    }
  }

  // 11) Alumni -> dashboard student
  if (cleanPath.startsWith('/alumni/')) {
    return navigateTo('/student/dashboard')
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