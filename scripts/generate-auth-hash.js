/**
 * Genera AUTH_PASSWORD_HASH para .env.local
 * Uso: node scripts/generate-auth-hash.js
 * Contraseña por defecto: Teamo (como en el requerimiento)
 */

const { scrypt } = require('crypto')
const { promisify } = require('util')
const scryptAsync = promisify(scrypt)

const SALT = 'cachetona-admin-v1'
const PASSWORD = process.env.AUTH_PASSWORD || 'Teamo'

async function main() {
	const key = await scryptAsync(PASSWORD, SALT, 64)
	const hash = key.toString('hex')
	console.log('Añadí estas variables a .env.local:\n')
	console.log('AUTH_PASSWORD_HASH=' + hash)
	console.log('AUTH_SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))
	console.log('\nLa contraseña usada fue:', PASSWORD === 'Teamo' ? 'Teamo (por defecto)' : PASSWORD)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
