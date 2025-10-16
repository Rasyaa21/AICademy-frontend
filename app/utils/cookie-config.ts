export const getCookieConfig = () => {
  // Check if we're in production environment
  const isProduction = process.env.NODE_ENV === 'production'
  
  // For production, use secure cookies with SameSite=None (requires HTTPS)
  // For development, use non-secure cookies with SameSite=Lax
  const isSecure = isProduction
  
  return {
    httpOnly: false,
    secure: isSecure,
    sameSite: isSecure ? ('none' as const) : ('lax' as const),
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
}

// Alternative: Environment-specific config
export const getCookieConfigByEnv = () => {
  const config = useRuntimeConfig()
  
  // You can also set this via runtime config
  const isProduction = config.public.appEnv === 'production'
  
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  }
}