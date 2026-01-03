import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
// Revalidar cada hora para asegurar cambio a medianoche
export const revalidate = 3600

/**
 * Calcula el día del año (1-365) basado en la fecha actual
 * Maneja años bisiestos correctamente
 * Usa UTC para consistencia en producción (Vercel)
 */
function getDayOfYear(): number {
	const now = new Date()
	const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0))
	const diff = now.getTime() - start.getTime()
	const oneDay = 1000 * 60 * 60 * 24
	const day = Math.floor(diff / oneDay)

	// Retornar día del año (1-365 o 1-366 en años bisiestos)
	// Para años bisiestos, el día 366 se mapea al 365
	return Math.min(day, 365)
}

export async function GET() {
	try {
		// Fallback phrases in case of DB failure or missing connection
		const FALLBACK_PHRASES = [
			{ id: 'fb-1', text: 'Recuerda que si tú me amas, yo te amo más', author: null, active: true },
			{ id: 'fb-2', text: 'Eres lo mejor que me ha pasado', author: null, active: true },
			{ id: 'fb-3', text: 'Juntos hasta las estrellas', author: null, active: true },
			{ id: 'fb-4', text: 'Mi amor por ti es infinito', author: null, active: true },
			{ id: 'fb-5', text: 'Tu sonrisa ilumina mi universo', author: null, active: true },
		]

		let phrases = []

		// Intentar obtener frases de Supabase
		try {
			const { data: dbPhrases, error } = await supabase
				.from('daily_phrases')
				.select('*')
				.eq('active', true)
				.order('id', { ascending: true })

			if (error) {
				console.error('Supabase error:', error)
				// Si falla la conexión, usar fallback silenciosamente
				phrases = FALLBACK_PHRASES
			} else {
				phrases = dbPhrases || []
			}
		} catch (err) {
			console.error('Connection error:', err)
			phrases = FALLBACK_PHRASES
		}

		// Si por alguna razón aún no hay frases (tabla vacía + fallo fallback), usar fallback
		if (phrases.length === 0) {
			phrases = FALLBACK_PHRASES
		}

		// Calcular el día del año (1-365)
		const dayOfYear = getDayOfYear()

		// Seleccionar la frase correspondiente al día del año
		// Usa módulo para asegurar que siempre haya una frase disponible
		// Si hay menos de 365 frases, las frases se repetirán en el año
		const phraseIndex = (dayOfYear - 1) % phrases.length
		const selectedPhrase = phrases[phraseIndex]

		// Agregar metadata útil para debugging (solo en desarrollo)
		const response: any = { phrase: selectedPhrase }

		if (process.env.NODE_ENV === 'development') {
			response.metadata = {
				dayOfYear,
				phraseIndex: phraseIndex + 1,
				totalPhrases: phrases.length,
				timestamp: new Date().toISOString()
			}
		}

		return NextResponse.json(response)
	} catch (error) {
		console.error('Unexpected error:', error)
		return NextResponse.json(
			{ error: 'Error inesperado' },
			{ status: 500 }
		)
	}
}
