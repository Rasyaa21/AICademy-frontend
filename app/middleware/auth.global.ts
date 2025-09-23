// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware di server untuk menghindari hydration issues
  if (import.meta.server) {
    return
  }

  // Wait for hydration to complete
  if (!import.meta.client) {
    return
  }

  console.log('🔧 Middleware running for:', to.path)
  
  const publicRoutes = new Set(['/login', '/register', '/forgot-password', '/', '/reset-password', '/email-verification'])

  const tokenRef = useCookie<string | null>('token', {
    default: () => null,
    httpOnly: false,
    secure: false,
    sameSite: 'lax'
  })
  
  const roleRef = useCookie<'admin'|'teacher'|'student'|'alumni'|'company'|null>('role', {
    default: () => null,
    httpOnly: false,
    secure: false,
    sameSite: 'lax'
  })
  
  const token = tokenRef.value
  const role = roleRef.value

  console.log('🍪 Token:', token ? 'EXISTS' : 'NULL')
  console.log('👤 Role:', role)

  // Jika di public route
  if (publicRoutes.has(to.path)) {
    // Jika sudah login dan mencoba akses login/register, redirect ke dashboard
    if ((to.path === '/login' || to.path === '/register') && token && role) {
      console.log('🔄 Redirecting authenticated user to dashboard')
      return navigateTo(roleToDashboard(role))
    }
    return
  }

  // Jika tidak ada token atau role, redirect ke login
  if (!token || !role) {
    console.log('❌ No token/role, redirecting to login')
    return navigateTo('/login')
  }

  // Redirect dari /dashboard ke dashboard sesuai role
  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    console.log('🔄 Redirecting to role-specific dashboard')
    return navigateTo(roleToDashboard(role))
  }

  // Role-based access control
  if (role !== 'admin' && to.path.startsWith('/admin/')) {
    console.log('🚫 Non-admin trying to access admin area')
    return navigateTo(roleToDashboard(role))
  }

  if (to.path.startsWith('/teacher/') && !['teacher', 'admin'].includes(role)) {
    console.log('🚫 Unauthorized access to teacher area')
    return navigateTo(roleToDashboard(role))
  }

  if (to.path.startsWith('/alumni/')) {
    console.log('🔄 Alumni redirect to student dashboard')
    return navigateTo('/student/dashboard')
  }

  if (to.path.startsWith('/student/') && !['student', 'admin', 'alumni'].includes(role)) {
    console.log('🚫 Unauthorized access to student area')
    return navigateTo(roleToDashboard(role))
  }

  if (to.path.startsWith('/company/') && !['company', 'admin'].includes(role)) {
    console.log('🚫 Unauthorized access to company area')
    return navigateTo(roleToDashboard(role))
  }

  console.log('✅ Access granted to:', to.path)
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