/**
 * Auth constants safe for Edge (middleware) and client (types only). Do not import auth-server in middleware.
 */
export const COOKIE_NAME = 'cachetona_session'
export const ALLOWED_USERNAMES = ['Tefy', 'Santi'] as const
export type AllowedUsername = (typeof ALLOWED_USERNAMES)[number]

export function getCookieName(): string {
	return COOKIE_NAME
}
