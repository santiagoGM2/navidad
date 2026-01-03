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
		// Obtener todas las frases activas ordenadas por ID
		// Esto asegura un orden consistente
		const { data, error } = await supabase
			.from('daily_phrases')
			.select('*')
			.eq('active', true)
			.order('id', { ascending: true })

		if (error) {
			console.error('Error fetching phrases:', error)
			return NextResponse.json(
				{ error: 'Error al obtener las frases' },
				{ status: 500 }
			)
		}

		if (!data || data.length === 0) {
			return NextResponse.json(
				{ error: 'No hay frases disponibles' },
				{ status: 404 }
			)
		}

		// Calcular el día del año (1-365)
		const dayOfYear = getDayOfYear()
		
		// Seleccionar la frase correspondiente al día del año
		// Usa módulo para asegurar que siempre haya una frase disponible
		// Si hay menos de 365 frases, las frases se repetirán en el año
		const phraseIndex = (dayOfYear - 1) % data.length
		const selectedPhrase = data[phraseIndex]

		// Agregar metadata útil para debugging (solo en desarrollo)
		const response: any = { phrase: selectedPhrase }
		
		if (process.env.NODE_ENV === 'development') {
			response.metadata = {
				dayOfYear,
				phraseIndex: phraseIndex + 1,
				totalPhrases: data.length,
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
