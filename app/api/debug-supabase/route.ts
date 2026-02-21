
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseConfig } from '@/lib/supabase-config'

export async function GET() {
    const { url, key } = getSupabaseConfig()
    try {
        const start = Date.now()
        const res = await fetch(`${url}/rest/v1/?apikey=${key}`, {
            method: 'HEAD',
            cache: 'no-store'
        })
        const duration = Date.now() - start
        return NextResponse.json({
            status: res.status,
            statusText: res.statusText,
            duration: `${duration}ms`,
            url: url.substring(0, 20) + '...',
            reachable: res.ok || res.status === 401 || res.status === 400
        })
    } catch (err: any) {
        return NextResponse.json({
            error: 'Fetch failed',
            message: err.message,
            url: url.substring(0, 20) + '...',
            stack: err.stack
        }, { status: 500 })
    }
}
