/**
 * Admin DB helpers: daily_memories stats and list.
 * Use only from server (API routes, Server Components).
 */

import { supabaseAdmin } from '@/lib/supabase-server'

export interface DailyMemoryRow {
	id: string
	url: string
	fecha_subida: string
	tipo: 'foto' | 'video'
	usuario_subio: string
	descripcion: string | null
}

export async function getDailyMemoriesStats(): Promise<{
	totalPhotos: number
	activeDays: number
	photosThisYear: number
}> {
	const client = supabaseAdmin
	if (!client) {
		return { totalPhotos: 0, activeDays: 0, photosThisYear: 0 }
	}
	try {
		const year = new Date().getFullYear()
		const startTime = `${year}-01-01T00:00:00Z`

		const { count: totalPhotos } = await client
			.from('collage_recuerdos')
			.select('*', { count: 'exact', head: true })

		const { count: photosThisYear } = await client
			.from('collage_recuerdos')
			.select('*', { count: 'exact', head: true })
			.gte('fecha_subida', startTime)

		const { data: rows } = await client
			.from('collage_recuerdos')
			.select('fecha_subida')
			.limit(5000)

		const uniqueDays = new Set((rows ?? []).map((r) => String(r.fecha_subida).slice(0, 10))).size

		return {
			totalPhotos: totalPhotos ?? 0,
			activeDays: uniqueDays,
			photosThisYear: photosThisYear ?? 0,
		}
	} catch (err) {
		console.error('Error getting stats:', err)
		return { totalPhotos: 0, activeDays: 0, photosThisYear: 0 }
	}
}

export async function listDailyMemories(options?: {
	limit?: number
	offset?: number
}): Promise<DailyMemoryRow[]> {
	const client = supabaseAdmin
	if (!client) return []
	try {
		let q = client
			.from('collage_recuerdos')
			.select('id, url, fecha_subida, tipo, usuario_subio, descripcion')
			.order('fecha_subida', { ascending: false })

		if (options?.limit != null) q = q.limit(options.limit)
		if (options?.offset != null) q = q.range(options.offset, options.offset + (options.limit ?? 50) - 1)

		const { data, error } = await q
		if (error || !data) return []
		return data.map(item => ({
			id: item.id,
			url: item.url,
			fecha_subida: item.fecha_subida,
			tipo: item.tipo as 'foto' | 'video',
			usuario_subio: item.usuario_subio,
			descripcion: item.descripcion
		}))
	} catch {
		return []
	}
}
