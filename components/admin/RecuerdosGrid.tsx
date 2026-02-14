'use client'

import Image from 'next/image'

export interface DailyMemoryRow {
	id: string
	image_url: string
	created_at: string
	uploaded_by: string
	description: string | null
	day_of_year: number
	year: number
}

function formatDate(createdAt: string): string {
	const d = new Date(createdAt)
	return d.toLocaleDateString('es-AR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

export default function RecuerdosGrid({
	initialMemories,
}: {
	initialMemories: DailyMemoryRow[]
}) {
	if (initialMemories.length === 0) {
		return (
			<p className="text-white/60 text-center py-12">
				Aún no hay fotos. Subí la primera desde Subir foto diaria.
			</p>
		)
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{initialMemories.map((m) => (
				<div
					key={m.id}
					className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10"
				>
					<Image
						src={m.image_url}
						alt={m.description || formatDate(m.created_at)}
						fill
						className="object-cover"
						sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
						unoptimized={m.image_url.startsWith('http') && new URL(m.image_url).hostname.includes('supabase')}
					/>
					<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
						{formatDate(m.created_at)} · {m.uploaded_by}
					</div>
				</div>
			))}
		</div>
	)
}
