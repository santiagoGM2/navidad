import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase-config'

export const dynamic = 'force-dynamic'

const ADMIN_USERS = ['Santi', 'Tefy']

function isAdmin(username: string): boolean {
    return ADMIN_USERS.some(u => u.toLowerCase() === username.toLowerCase())
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSessionFromCookie()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        if (!isAdmin(session.username)) {
            return NextResponse.json({ error: 'Solo administradores pueden eliminar recuerdos' }, { status: 403 })
        }

        const body = await request.json()
        const { id, file_path } = body

        if (!id) {
            return NextResponse.json({ error: 'Falta el ID del recuerdo' }, { status: 400 })
        }

        const { url, key } = getSupabaseConfig()
        const supabase = createClient(url, key)

        // Delete from storage if we have the path
        if (file_path) {
            const parts = file_path.split('/')
            const bucket = parts[0]
            const path = parts.slice(1).join('/')

            if (bucket && path) {
                const { error: storageError } = await supabase.storage
                    .from(bucket)
                    .remove([path])

                if (storageError) {
                    console.warn('Storage delete warning:', storageError.message)
                }
            }
        }

        // Delete from database
        const { error: dbError } = await supabase
            .from('collage_recuerdos')
            .delete()
            .eq('id', id)

        if (dbError) {
            console.error('DB delete error:', dbError)
            return NextResponse.json({
                error: 'Error al eliminar recuerdo',
                details: dbError.message,
            }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Delete error:', err)
        return NextResponse.json({
            error: 'Error interno',
            details: err.message || String(err),
        }, { status: 500 })
    }
}
