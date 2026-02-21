import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase-config'

export async function POST(request: NextRequest) {
	try {
		const { url, key: effectiveKey, usingServiceKey } = getSupabaseConfig()

		// DETERMINISMO DE KEYS (LOGS DE DEPURACIÓN)
		console.log('[DEBUG MEMORIES] Config check:', {
			urlPrefix: url.substring(0, 10),
			usingServiceKey,
			keyLength: effectiveKey.length
		})

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

		// Crear cliente Supabase con la llave efectiva
		const supabase = createClient(url, effectiveKey)

		const today = new Date().toISOString().split('T')[0]

		// Subir a Storage
		const fileExt = file.name.split('.').pop()
		const fileName = `${session.username}_${Date.now()}.${fileExt}`
		const filePath = `${today}/${fileName}`

		const arrayBuffer = await file.arrayBuffer()

		const { error: uploadError } = await supabase.storage
			.from('daily-memories')
			.upload(filePath, arrayBuffer, {
				contentType: file.type,
				upsert: false,
			})

		if (uploadError) {
			console.error('Upload error:', uploadError)
			return NextResponse.json({
				error: 'Error al subir imagen',
				details: uploadError.message
			}, { status: 500 })
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
			return NextResponse.json({
				error: 'Error al guardar metadatos en la base de datos',
				details: dbError.message
			}, { status: 500 })
		}

		return NextResponse.json({
			success: true,
			url: urlData.publicUrl,
		})
	} catch (err: any) {
		console.error('upload-daily error:', err)
		return NextResponse.json({
			error: 'Error interno en el servidor',
			details: err.message || String(err)
		}, { status: 500 })
	}
}
