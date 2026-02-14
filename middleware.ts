import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookieName } from '@/lib/auth-constants'

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	if (!pathname.startsWith('/admin')) return NextResponse.next()

	if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
		return NextResponse.next()
	}

	const cookieName = getCookieName()
	const token = request.cookies.get(cookieName)?.value
	if (!token || token.length < 10) {
		const login = new URL('/admin/login', request.url)
		login.searchParams.set('from', pathname)
		return NextResponse.redirect(login)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin', '/admin/:path*'],
}
