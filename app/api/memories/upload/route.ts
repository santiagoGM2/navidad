import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
	try {
		// Verificar sesión
		const session = await getSessionFromCookie()
		if (!session) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		// Obtener archivo
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 })
		}

		// Validar tipo
		if (!file.type.startsWith('image/')) {
			return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
		}

		// Validar tamaño (10MB)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json({ error: 'Imagen muy grande (máx 10MB)' }, { status: 400 })
		}

		// Crear cliente Supabase
		const supabase = createClient(supabaseUrl, supabaseServiceKey)

		const today = new Date().toISOString().split('T')[0]

		// Subir a Storage
		const fileExt = file.name.split('.').pop()
		const fileName = `${session.username}_${Date.now()}.${fileExt}`
		const filePath = `${today}/${fileName}`

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		const { error: uploadError } = await supabase.storage
			.from('daily-memories')
			.upload(filePath, buffer, {
				contentType: file.type,
				upsert: false,
			})

		if (uploadError) {
			console.error('Upload error:', uploadError)
			return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
		}

		// Obtener URL pública
		const { data: urlData } = supabase.storage
			.from('daily-memories')
			.getPublicUrl(filePath)

		// Guardar metadata en DB
		const { error: dbError } = await supabase
			.from('daily_memories')
			.insert({
				username: session.username,
				image_url: urlData.publicUrl,
				file_path: filePath,
			})

		if (dbError) {
			console.error('DB error:', dbError)
			// No borramos la imagen por seguridad, pero logueamos error
			return NextResponse.json({ error: 'Error al guardar metadatos' }, { status: 500 })
		}

		return NextResponse.json({
			success: true,
			url: urlData.publicUrl,
		})
	} catch (err) {
		console.error('Upload error:', err)
		return NextResponse.json({ error: 'Error interno' }, { status: 500 })
	}
}
