/**
 * Admin DB helpers: daily_memories stats and list.
 * Use only from server (API routes, Server Components).
 */

import { supabaseAdmin } from '@/lib/supabase-server'

export interface DailyMemoryRow {
	id: string
	image_url: string
	created_at: string
	uploaded_by: string
	description: string | null
	day_of_year: number
	year: number
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
		const { count: totalPhotos } = await client
			.from('daily_memories')
			.select('*', { count: 'exact', head: true })
		const { count: photosThisYear } = await client
			.from('daily_memories')
			.select('*', { count: 'exact', head: true })
			.eq('year', year)
		const { data: rows } = await client
			.from('daily_memories')
			.select('created_at')
			.limit(5000)
		const uniqueDays = new Set((rows ?? []).map((r) => String(r.created_at).slice(0, 10))).size
		return {
			totalPhotos: totalPhotos ?? 0,
			activeDays: uniqueDays,
			photosThisYear: photosThisYear ?? 0,
		}
	} catch {
		return { totalPhotos: 0, activeDays: 0, photosThisYear: 0 }
	}
}

export async function listDailyMemories(options?: {
	year?: number
	limit?: number
	offset?: number
}): Promise<DailyMemoryRow[]> {
	const client = supabaseAdmin
	if (!client) return []
	try {
		let q = client
			.from('daily_memories')
			.select('id, image_url, created_at, uploaded_by, description, day_of_year, year')
			.order('created_at', { ascending: false })
		if (options?.year != null) {
			q = q.eq('year', options.year)
		}
		if (options?.limit != null) q = q.limit(options.limit)
		if (options?.offset != null) q = q.range(options.offset, options.offset + (options.limit ?? 50) - 1)
		const { data, error } = await q
		if (error || !data) return []
		return data as DailyMemoryRow[]
	} catch {
		return []
	}
}
