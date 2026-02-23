import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase-config'

export const dynamic = 'force-dynamic'

const ADMIN_USERS = ['Santi', 'Tefy']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

function isAdmin(username: string): boolean {
    return ADMIN_USERS.some(u => u.toLowerCase() === username.toLowerCase())
}

export async function POST(request: NextRequest) {
    try {
        const { url, key: effectiveKey } = getSupabaseConfig()

        const session = await getSessionFromCookie()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        if (!isAdmin(session.username)) {
            return NextResponse.json({ error: 'Solo administradores pueden subir recuerdos' }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 })
        }

        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')

        if (!isImage && !isVideo) {
            return NextResponse.json({ error: 'Solo se permiten imágenes o videos' }, { status: 400 })
        }

        const limit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
        if (file.size > limit) {
            return NextResponse.json({
                error: `Archivo muy grande (máx ${isVideo ? '100MB' : '10MB'})`
            }, { status: 400 })
        }

        const supabase = createClient(url, effectiveKey)

        const fileExt = file.name.split('.').pop()?.toLowerCase() || (isImage ? 'jpg' : 'mp4')
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`

        const arrayBuffer = await file.arrayBuffer()

        let bucketName = 'collage'
        let filePath = fileName

        let { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, arrayBuffer, {
                contentType: file.type,
                upsert: false,
            })

        if (uploadError && (uploadError as any).message?.includes('bucket')) {
            bucketName = 'daily-memories'
            filePath = `collage/${fileName}`
            const { error: fallbackError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, arrayBuffer, {
                    contentType: file.type,
                    upsert: false,
                })

            if (fallbackError) {
                console.error('Fallback upload error:', fallbackError)
                return NextResponse.json({
                    error: 'Error al subir archivo',
                    details: fallbackError.message,
                }, { status: 500 })
            }
        } else if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({
                error: 'Error al subir archivo',
                details: uploadError.message,
            }, { status: 500 })
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)
        const publicUrl = urlData.publicUrl

        const tipo = isImage ? 'foto' : 'video'

        const { data: insertedRow, error: dbError } = await supabase
            .from('collage_recuerdos')
            .insert({
                url: publicUrl,
                tipo,
                usuario_subio: session.username,
                file_path: `${bucketName}/${filePath}`,
            })
            .select()
            .single()

        if (dbError) {
            console.error('DB insert error:', dbError)
            return NextResponse.json({
                success: true,
                recuerdo: {
                    id: crypto.randomUUID(),
                    url: publicUrl,
                    fecha_subida: new Date().toISOString(),
                    tipo,
                    usuario_subio: session.username,
                },
                warning: 'Archivo subido pero no se pudo guardar metadata en DB'
            })
        }

        return NextResponse.json({
            success: true,
            recuerdo: insertedRow,
        })
    } catch (err: any) {
        console.error('Upload error:', err)
        return NextResponse.json({
            error: 'Error interno en el servidor',
            details: err.message || String(err)
        }, { status: 500 })
    }
}
