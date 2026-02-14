import { NextResponse } from 'next/server'
import { getCookieName } from '@/lib/auth-server'

export async function POST() {
	const cookieName = getCookieName()
	const res = NextResponse.json({ success: true })
	res.cookies.set(cookieName, '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 0,
		path: '/',
	})
	return res
}
