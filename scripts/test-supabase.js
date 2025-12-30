/**
 * Script de prueba para verificar la conexión con Supabase
 * Ejecutar con: node scripts/test-supabase.js
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	console.error('❌ Error: Faltan variables de entorno')
	console.log('\nAsegúrate de tener un archivo .env.local con:')
	console.log('NEXT_PUBLIC_SUPABASE_URL=...')
	console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
	console.log('🔍 Probando conexión con Supabase...\n')
	console.log(`URL: ${supabaseUrl}\n`)

	try {
		// Probar conexión básica
		const { data, error } = await supabase
			.from('daily_phrases')
			.select('count')
			.eq('active', true)

		if (error) {
			console.error('❌ Error de conexión:', error.message)
			console.log('\n💡 Posibles soluciones:')
			console.log('1. Verifica que la tabla daily_phrases existe')
			console.log('2. Ejecuta el script SQL en supabase/schema.sql')
			console.log('3. Verifica que la Anon Key es correcta')
			process.exit(1)
		}

		// Obtener todas las frases
		const { data: phrases, error: phrasesError } = await supabase
			.from('daily_phrases')
			.select('*')
			.eq('active', true)

		if (phrasesError) {
			console.error('❌ Error al obtener frases:', phrasesError.message)
			process.exit(1)
		}

		console.log('✅ Conexión exitosa!')
		console.log(`📝 Frases encontradas: ${phrases.length}\n`)

		if (phrases.length > 0) {
			console.log('📋 Primeras frases:')
			phrases.slice(0, 3).forEach((phrase, index) => {
				console.log(`   ${index + 1}. "${phrase.text}"`)
			})
		} else {
			console.log('⚠️  No hay frases activas. Añade algunas desde el dashboard de Supabase.')
		}

		console.log('\n🎉 Todo está configurado correctamente!')
	} catch (err) {
		console.error('❌ Error inesperado:', err.message)
		process.exit(1)
	}
}

testConnection()

