import { NextResponse, type NextRequest } from 'next/server'

const NOMBRE_COOKIE = 'cdi_session'

/** Comprobación optimista: sólo mira si existe la cookie, sin verificar la
 *  firma ni consultar la base (el proxy corre en cada petición y debe ser
 *  barato). La verificación real vive en src/lib/dal.ts. */
export function proxy(request: NextRequest) {
  const tieneCookie = Boolean(request.cookies.get(NOMBRE_COOKIE)?.value)
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !tieneCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (pathname === '/login' && tieneCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
