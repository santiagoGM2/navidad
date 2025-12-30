import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
	try {
		// Obtener todas las frases activas
		const { data, error } = await supabase
			.from('daily_phrases')
			.select('*')
			.eq('active', true)

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

		// Seleccionar una frase basada en la fecha del día (determinista)
		// Esto asegura que la misma frase se muestre todo el día
		const today = new Date()
		const dayOfYear = Math.floor(
			(today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
		)
		const phraseIndex = dayOfYear % data.length
		const selectedPhrase = data[phraseIndex]

		return NextResponse.json({ phrase: selectedPhrase })
	} catch (error) {
		console.error('Unexpected error:', error)
		return NextResponse.json(
			{ error: 'Error inesperado' },
			{ status: 500 }
		)
	}
}
