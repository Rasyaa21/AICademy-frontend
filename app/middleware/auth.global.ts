// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = new Set(['/login', '/register', '/forgot-password', '/', '/reset-password'])

  const tokenRef = useCookie<string | null>('token')
  const roleRef  = useCookie<'admin'|'teacher'|'student'|'alumni'|'company'|null>('role')
  const token = tokenRef.value
  const role  = roleRef.value

  if (publicRoutes.has(to.path)) {
    if (to.path === '/login' && token && role || to.path === '/register' && token && role) {
      return navigateTo(roleToDashboard(role))
    }
    return
  }

  if (!token || !role) {
    return navigateTo('/login')
  }

  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    return navigateTo(roleToDashboard(role))
  }

  if (role !== 'admin' && to.path.startsWith('/admin/')) {
    return navigateTo(roleToDashboard(role))
  }

  if (to.path.startsWith('/teacher/') && !['teacher', 'admin'].includes(role)) {
    return navigateTo(roleToDashboard(role))
  }

  if (to.path.startsWith('/alumni/')) {
    return navigateTo('/student/dashboard')
  }

  if (to.path.startsWith('/student/') && !['student', 'admin', 'alumni'].includes(role)) {
    return navigateTo(roleToDashboard(role))
  }

  if (to.path.startsWith('/company/') && !['company', 'admin'].includes(role)) {
    return navigateTo(roleToDashboard(role))
  }
})

function roleToDashboard(role: 'admin'|'teacher'|'student'|'alumni'|'company'): string {
  switch (role) {
    case 'admin':   return '/admin/dashboard'
    case 'teacher': return '/teacher/dashboard'
    case 'company': return '/company/dashboard'
    case 'alumni':  return '/student/dashboard'
    case 'student':
    default:        return '/student/dashboard'
  }
}