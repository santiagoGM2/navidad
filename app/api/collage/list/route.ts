import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase-config'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { url, key } = getSupabaseConfig()
        const supabase = createClient(url, key)

        const { data, error } = await supabase
            .from('collage_recuerdos')
            .select('*') // Seleccionamos todo para tener la metadata completa
            .order('fecha_captura', { ascending: false })

        if (error) {
            console.error('Error fetching collage:', error)
            return NextResponse.json({
                recuerdos: [],
                error: 'Error al obtener recuerdos',
                details: error.message,
            }, { status: 500 })
        }

        return new NextResponse(JSON.stringify({
            recuerdos: data || [],
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            }
        })
    } catch (err: any) {
        console.error('List collage error:', err)
        return NextResponse.json({
            recuerdos: [],
            error: 'Error interno',
            details: err.message || String(err),
        }, { status: 500 })
    }
}
