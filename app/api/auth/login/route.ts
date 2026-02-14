import { NextRequest, NextResponse } from 'next/server'
import {
	verifyPassword,
	isAllowedUsername,
	createSessionToken,
	getCookieName,
} from '@/lib/auth-server'

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const username = typeof body.username === 'string' ? body.username.trim() : ''
		const password = typeof body.password === 'string' ? body.password : ''

		if (!username || !password) {
			return NextResponse.json(
				{ error: 'Usuario y contraseña requeridos' },
				{ status: 400 }
			)
		}

		if (!isAllowedUsername(username)) {
			return NextResponse.json(
				{ error: 'Usuario no autorizado' },
				{ status: 403 }
			)
		}

		const valid = await verifyPassword(password)
		if (!valid) {
			return NextResponse.json(
				{ error: 'Contraseña incorrecta' },
				{ status: 401 }
			)
		}

		const exp = Date.now() + COOKIE_MAX_AGE * 1000
		const token = createSessionToken({ username, exp })

		const cookieName = getCookieName()
		const res = NextResponse.json({ success: true, username })
		res.cookies.set(cookieName, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: COOKIE_MAX_AGE,
			path: '/',
		})
		return res
	} catch (err) {
		console.error('Login error:', err)
		return NextResponse.json(
			{ error: 'Error al iniciar sesión' },
			{ status: 500 }
		)
	}
}
