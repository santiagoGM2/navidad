import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FALLBACK_PHRASES = [
	{ id: 'fb-1', text: 'Recuerda que si tú me amas, yo te amo más', author: null },
	{ id: 'fb-2', text: 'Eres lo mejor que me ha pasado', author: null },
	{ id: 'fb-3', text: 'Juntos hasta las estrellas', author: null },
	{ id: 'fb-4', text: 'Mi amor por ti crece cada día', author: null },
	{ id: 'fb-5', text: 'Contigo quiero envejecer', author: null },
]

function getDayOfYearFromDate(dateStr: string): number {
	const [y, m, d] = dateStr.split('-').map(Number)
	const start = new Date(Date.UTC(y, 0, 0))
	const current = new Date(Date.UTC(y, m - 1, d))
	const diff = current.getTime() - start.getTime()
	const oneDay = 1000 * 60 * 60 * 24
	const day = Math.floor(diff / oneDay)
	return Math.min(Math.max(day, 1), 365)
}

/**
 * Devuelve exactamente 2 frases distintas para el día indicado.
 * Determinístico: misma fecha → mismas 2 frases. Rota cada día.
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const dateParam = searchParams.get('date')
		const today = new Date()
		const dateStr =
			dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
				? dateParam
				: today.toISOString().split('T')[0]

		let phrases: { id: string; text: string; author: string | null }[] = []

		try {
			const { data, error } = await supabase
				.from('daily_phrases')
				.select('id, text, author')
				.eq('active', true)
				.order('id', { ascending: true })

			if (!error && data && data.length > 0) {
				phrases = data.map((p) => ({
					id: String(p.id),
					text: p.text,
					author: p.author ?? null,
				}))
			}
		} catch {
			// ignore
		}

		if (phrases.length === 0) {
			phrases = FALLBACK_PHRASES
		}

		const dayOfYear = getDayOfYearFromDate(dateStr)
		const n = phrases.length
		const seed = dayOfYear * 2
		const index1 = seed % n
		let index2 = (seed + 1) % n
		if (n > 1 && index1 === index2) {
			index2 = (index1 + 1) % n
		}

		const phrase1 = phrases[index1]
		const phrase2 = index1 !== index2 ? phrases[index2] : phrases[(index1 + 1) % n]

		return NextResponse.json({
			date: dateStr,
			phrases: [phrase1, phrase2],
		})
	} catch (err) {
		console.error('phrases/daily error:', err)
		return NextResponse.json(
			{
				date: new Date().toISOString().split('T')[0],
				phrases: FALLBACK_PHRASES.slice(0, 2),
			},
			{ status: 200 }
		)
	}
}
