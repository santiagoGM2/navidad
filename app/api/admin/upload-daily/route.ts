import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase-config'

export const dynamic = 'force-dynamic'

const BUCKET = 'daily-memories'
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function getDayOfYear(d: Date): number {
	const start = new Date(d.getFullYear(), 0, 0)
	const diff = d.getTime() - start.getTime()
	return Math.floor(diff / (24 * 60 * 60 * 1000))
}

export async function POST(request: NextRequest) {
	try {
		const { url, key, usingServiceKey } = getSupabaseConfig()

		const session = await getSessionFromCookie()
		if (!session) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const client = createClient(url, key)
		if (!client || !usingServiceKey) {
			console.warn('[UPLOAD DAILY] Missing service key, using best available.')
		}

		const formData = await request.formData()
		const file = formData.get('file') as File | null
		const description = (formData.get('description') as string)?.trim() ?? ''

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ error: 'Falta la imagen' },
				{ status: 400 }
			)
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Solo se permiten JPEG, PNG o WebP' },
				{ status: 400 }
			)
		}

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: 'Imagen demasiado grande (máx. 8 MB)' },
				{ status: 400 }
			)
		}

		const now = new Date()
		const year = now.getFullYear()
		const dayOfYear = getDayOfYear(now)

		const { data: existing } = await client
			.from('daily_memories')
			.select('id')
			.eq('year', year)
			.eq('day_of_year', dayOfYear)
			.eq('uploaded_by', session.username)
			.maybeSingle()

		if (existing) {
			return NextResponse.json(
				{ error: 'Ya subiste una foto hoy. Una por día.' },
				{ status: 400 }
			)
		}

		const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
		const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
		const path = `${year}/${dayOfYear}-${session.username}-${Date.now()}.${safeExt}`

		const arrayBuffer = await file.arrayBuffer()
		const { error: uploadError } = await client.storage
			.from(BUCKET)
			.upload(path, arrayBuffer, {
				contentType: file.type,
				upsert: false,
			})

		if (uploadError) {
			console.error('Upload error:', uploadError)
			return NextResponse.json(
				{ error: 'Error al subir la imagen' },
				{ status: 500 }
			)
		}

		const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(path)
		const imageUrl = urlData.publicUrl

		const { error: insertError } = await client.from('daily_memories').insert({
			image_url: imageUrl,
			uploaded_by: session.username,
			description: description || null,
			day_of_year: dayOfYear,
			year,
		})

		if (insertError) {
			console.error('Insert error:', insertError)
			return NextResponse.json(
				{ error: 'Error al guardar el recuerdo' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true, imageUrl })
	} catch (err: any) {
		console.error('upload-daily error:', err)
		return NextResponse.json({
			error: 'Error interno en el servidor',
			details: err.message || String(err)
		}, { status: 500 })
	}
}
