import { NextRequest, NextResponse } from 'next/server'
import { decryptSession } from '@/app/lib/auth/session'
import { RouteAuthorizer } from '@/app/lib/auth/RouteAuthorizer'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const session = await decryptSession()
  const role = session?.roles || 'public'

  const homeUrl = new URL('/home', req.nextUrl.origin)
  const loginUrl = new URL('/login', req.nextUrl.origin)

  if (RouteAuthorizer.isPublic(path)) {
    return NextResponse.next()
  }

  if (RouteAuthorizer.isAllowed(role, path)) {
    return NextResponse.next()
  }

  /*
  // Si no tiene algun rol lo envia a public
  if (role !== 'public') {
    return NextResponse.redirect(homeUrl)
  }
  //si no tiene ningun rol lo envia a login
  return NextResponse.redirect(loginUrl)
  */
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
