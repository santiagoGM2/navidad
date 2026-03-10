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

export async function getDailyMemoriesStats(username: string): Promise<{
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

		const { data: rows } = await client
			.from('collage_recuerdos')
			.select('fecha_subida')
			.ilike('usuario_subio', username)

		if (!rows) {
			return { totalPhotos: 0, activeDays: 0, photosThisYear: 0 }
		}

		const totalPhotos = rows.length
		let photosThisYear = 0
		const uniqueDays = new Set<string>()

		for (const r of rows) {
			const dateStr = String(r.fecha_subida)
			uniqueDays.add(dateStr.slice(0, 10))
			if (dateStr.startsWith(year.toString())) {
				photosThisYear++
			}
		}

		return {
			totalPhotos,
			activeDays: uniqueDays.size,
			photosThisYear,
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
