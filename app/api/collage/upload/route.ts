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

        // Validar tipo: Imagen o Video
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')

        if (!isImage && !isVideo) {
            return NextResponse.json({ error: 'Solo se permiten imágenes o videos' }, { status: 400 })
        }

        // Validar tamaño
        // Video: 100MB, Imagen: 10MB
        const limit = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > limit) {
            return NextResponse.json({ error: `Archivo muy grande (máx ${isVideo ? '100MB' : '10MB'})` }, { status: 400 })
        }

        // Crear cliente Supabase
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Subir a Storage
        // Usaremos el bucket 'collage-media' si existe, o una carpeta 'collage' en 'daily-memories' si no.
        // Vamos a intentar 'collage' bucket primero.
        let bucketName = 'collage'

        // Generar nombre de archivo único
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        // No usamos carpetas por fecha para el collage, todo plano para facilitar listado, o por mes
        const filePath = `${fileName}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Intentar subir a bucket 'collage'
        let { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            })

        // Si falla porque no existe el bucket, intentamos fallkback a 'daily-memories/collage'
        if (uploadError && (uploadError as any).message?.includes('bucket')) {
            bucketName = 'daily-memories'
            const fallbackPath = `collage/${fileName}`
            const { error: fallbackError } = await supabase.storage
                .from(bucketName)
                .upload(fallbackPath, buffer, {
                    contentType: file.type,
                    upsert: false,
                })

            if (fallbackError) {
                console.error('Fallback upload error:', fallbackError)
                return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
            }
        } else if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Archivo subido al collage'
        })
    } catch (err) {
        console.error('Upload error:', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
