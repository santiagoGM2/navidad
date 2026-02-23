'use client'

import Image from 'next/image'

export interface DailyMemoryRow {
	id: string
	url: string
	fecha_subida: string
	usuario_subio: string
	tipo: 'foto' | 'video'
	description?: string | null
}

function formatDate(dateStr: string): string {
	const d = new Date(dateStr)
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
				Aún no hay recuerdos. Subí el primero desde &quot;Subir Recuerdo&quot;.
			</p>
		)
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{initialMemories.map((m) => (
				<div
					key={m.id}
					className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group"
				>
					{m.tipo === 'foto' ? (
						<Image
							src={m.url}
							alt={m.description || formatDate(m.fecha_subida)}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-500"
							sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
							unoptimized={m.url.startsWith('http')}
						/>
					) : (
						<video
							src={m.url}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							muted
							loop
							playsInline
						/>
					)}
					<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						{formatDate(m.fecha_subida)} <br /> {m.usuario_subio}
					</div>
					{m.tipo === 'video' && (
						<div className="absolute top-2 right-2 p-1 bg-black/40 backdrop-blur-sm rounded-full pointer-events-none">
							<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
					)}
				</div>
			))}
		</div>
	)
}
