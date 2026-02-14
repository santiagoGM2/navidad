const crypto = require('crypto')
const { promisify } = require('util')
const scrypt = promisify(crypto.scrypt)

const SALT = 'cachetona-admin-v1'

async function hashPassword(password) {
  const key = await scrypt(password, SALT, 64)
  return key.toString('hex')
}

async function main() {
  const password = process.argv[2] || 'TeAmo'
  
  console.log('\n🔐 Generando hash de contraseña...\n')
  console.log(`Contraseña: "${password}"`)
  console.log(`Salt: "${SALT}"\n`)
  
  const hash = await hashPassword(password)
  
  console.log('✅ Hash generado:\n')
  console.log(`AUTH_PASSWORD_HASH=${hash}\n`)
  console.log('📋 Copia esta línea completa y pégala en tu archivo .env.local\n')
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
