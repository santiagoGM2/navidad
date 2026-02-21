/**
 * Auth server-only: hash verification, session sign/verify.
 * Never import this from client components.
 */

import { cookies } from 'next/headers'
import { createHmac, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

import { COOKIE_NAME, type AllowedUsername } from '@/lib/auth-constants'
export type { AllowedUsername } from '@/lib/auth-constants'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const SALT = 'cachetona-admin-v1'
const ALLOWED_USERNAMES = ['Tefy', 'Santi'] as const

// Fallback values to ensure it works immediately without restart
const FALLBACK_SECRET = '0jhSCju2K/pWQJhL1U3rq3BKvXQSnm+sR7OgDPVqLoc='
const FALLBACK_HASH = '2e13261f801ac0f449e4af138b472607e5dcd08f0f6324dd17ff33b7d16f1599b94c563e7f423d900f4ae9517a188a1d0aa24396a07e3e20de3d0ea462caaaab' // Hash for "TeAmo"

function getSecret(): string {
	return process.env.AUTH_SESSION_SECRET || FALLBACK_SECRET
}

function getStoredHash(): string {
	return process.env.AUTH_PASSWORD_HASH || FALLBACK_HASH
}

/** Hash password for comparison. Generate once and set AUTH_PASSWORD_HASH. */
export async function hashPassword(password: string): Promise<string> {
	const key = (await scryptAsync(password, SALT, 64)) as Buffer
	return key.toString('hex')
}

/** Verify password against env AUTH_PASSWORD_HASH. */
export async function verifyPassword(password: string): Promise<boolean> {
	try {
		const stored = getStoredHash()
		const computed = await hashPassword(password)
		if (computed.length !== stored.length) return false
		return timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(stored, 'hex'))
	} catch {
		return false
	}
}

export function isAllowedUsername(username: unknown): username is AllowedUsername {
	if (typeof username !== 'string') return false
	const normalized = username.toLowerCase().trim()
	return (ALLOWED_USERNAMES as readonly string[]).some(u => u.toLowerCase() === normalized)
}

/** Create signed session payload. */
function sign(payload: string): string {
	const secret = getSecret()
	const hmac = createHmac('sha256', secret)
	hmac.update(payload)
	return hmac.digest('base64url')
}

function verify(signed: string): { payload: string; valid: boolean } {
	const i = signed.lastIndexOf('.')
	if (i === -1) return { payload: '', valid: false }
	const payload = signed.slice(0, i)
	const sig = signed.slice(i + 1)
	const expected = sign(payload)
	try {
		const a = Buffer.from(sig, 'base64url')
		const b = Buffer.from(expected, 'base64url')
		const valid = payload.length > 0 && a.length === b.length && timingSafeEqual(a, b)
		return { payload, valid }
	} catch {
		return { payload: '', valid: false }
	}
}

export interface SessionPayload {
	username: AllowedUsername
	exp: number
}

export function createSessionToken(payload: SessionPayload): string {
	const data = JSON.stringify({ username: payload.username, exp: payload.exp })
	const b64 = Buffer.from(data).toString('base64url')
	return b64 + '.' + sign(b64)
}

export function parseSessionToken(token: string): SessionPayload | null {
	const { payload, valid } = verify(token)
	if (!valid) return null
	try {
		const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionPayload
		if (!data.exp || !isAllowedUsername(data.username)) return null
		if (Date.now() > data.exp) return null
		return data
	} catch {
		return null
	}
}

export { getCookieName } from '@/lib/auth-constants'

/** Get session from request cookies (for API routes use cookies()). */
export async function getSessionFromCookie(): Promise<SessionPayload | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get(COOKIE_NAME)?.value
	if (!token) return null
	return parseSessionToken(token)
}
