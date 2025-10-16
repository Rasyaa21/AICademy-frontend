export function getCookieConfig() {
  const config = useRuntimeConfig()
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'lax' as const,
    httpOnly: false,
    domain: isProduction ? config.public.cookieDomain || undefined : undefined,
    path: '/',
    // Tambahan untuk debug
    default: () => null,
  }
}