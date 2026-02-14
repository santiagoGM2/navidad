import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FALLBACK_PHRASES = [
	{ id: 'fb-1', text: 'Recuerda que si tú me amas, yo te amo más', author: null },
	{ id: 'fb-2', text: 'Eres lo mejor que me ha pasado', author: null },
	{ id: 'fb-3', text: 'Juntos hasta las estrellas', author: null },
]

export async function GET() {
	try {
		const { data, error } = await supabase
			.from('daily_phrases')
			.select('id, text, author')
			.eq('active', true)
			.order('id', { ascending: true })

		if (error || !data || data.length === 0) {
			return NextResponse.json({ phrases: FALLBACK_PHRASES })
		}

		const phrases = data.map((p) => ({
			id: p.id,
			text: p.text,
			author: p.author ?? null,
		}))

		return NextResponse.json({ phrases })
	} catch {
		return NextResponse.json({ phrases: FALLBACK_PHRASES })
	}
}
