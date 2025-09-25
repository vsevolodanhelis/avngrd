import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported locales
const locales = ['ua', 'en']
const defaultLocale = 'ua'

// Get locale from pathname
function getLocale(pathname: string): string | undefined {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  
  if (locales.includes(firstSegment)) {
    return firstSegment
  }
  
  return undefined
}

// Get locale from Accept-Language header
function getLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  
  if (!acceptLanguage) return defaultLocale
  
  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = '1'] = lang.trim().split(';q=')
      return { code: code.toLowerCase(), quality: parseFloat(q) }
    })
    .sort((a, b) => b.quality - a.quality)
  
  // Find best matching locale
  for (const { code } of languages) {
    if (code === 'uk' || code.startsWith('uk-')) return 'ua'
    if (code === 'en' || code.startsWith('en-')) return 'en'
  }
  
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }
  
  const pathnameLocale = getLocale(pathname)
  
  // If no locale in pathname, redirect to localized version
  if (!pathnameLocale) {
    // Get locale from cookie, otherwise use default (Ukrainian)
    const cookieLocale = request.cookies.get('avangard-language')?.value
    const preferredLocale = cookieLocale && locales.includes(cookieLocale)
      ? cookieLocale
      : defaultLocale  // Always default to Ukrainian unless cookie overrides

    // Redirect to localized path
    const localizedPath = `/${preferredLocale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(new URL(localizedPath, request.url))
  }
  
  // If locale is in pathname, set it in headers for the app to use
  const response = NextResponse.next()
  response.headers.set('x-locale', pathnameLocale)
  
  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public files (public folder)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
