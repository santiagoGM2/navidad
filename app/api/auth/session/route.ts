import { NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'

export async function GET() {
	try {
		const session = await getSessionFromCookie()
		if (!session) {
			return NextResponse.json({ user: null }, { status: 401 })
		}
		return NextResponse.json({ user: session.username })
	} catch {
		return NextResponse.json({ user: null }, { status: 401 })
	}
}
