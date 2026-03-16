import { NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST() {
	const session = getSessionFromCookie()
	if (!session || session.username.toLowerCase() !== 'tefy') {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
	}

	if (!supabaseAdmin) {
		return NextResponse.json({ error: 'DB no disponible' }, { status: 500 })
	}

	const coupons = [
		{ title: 'Cita Misteriosa', description: 'Tú eliges fecha, yo planeo todo', category: 'date' },
		{ title: 'Picnic Romántico', description: 'Con tus snacks favoritos', category: 'date' },
		{ title: 'Desayuno Sorpresa', description: 'A la cama con mucho amor', category: 'pampering' },
		{ title: 'Karaoke Privado', description: 'Cantamos hasta quedarnos sin voz', category: 'fun' },
		{ title: 'Te consiento hoy', description: 'Yo cocino y planeo todo el día', category: 'pampering' },
		{ title: 'Cita Elegante', description: 'Nos vestimos fancy para cenar', category: 'date' },
		{ title: 'Show Privado', description: 'De tu striper personal', category: 'spicy' },
		{ title: 'Mordida de Nalga', description: 'Permiso concedido', category: 'spicy' },
	]

	const rows = coupons.map((c) => ({
		username: 'TeFy',
		title: c.title,
		description: c.description,
		category: c.category,
		is_redeemed: false,
		created_at: new Date().toISOString(),
	}))

	const { error } = await supabaseAdmin
		.from('birthday_coupons')
		.upsert(rows, { onConflict: 'username,title' })

	if (error) {
		console.error('Error saving coupons:', error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ success: true, count: coupons.length })
}
