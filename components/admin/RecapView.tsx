import { listDailyMemories } from '@/lib/admin-db'
import RecapSlideshow from './RecapSlideshow'

export default async function RecapView() {
	const memories = await listDailyMemories({ limit: 500 })
	const sorted = [...memories].sort(
		(a, b) => new Date(a.fecha_subida).getTime() - new Date(b.fecha_subida).getTime()
	)

	if (sorted.length === 0) {
		return (
			<div className="backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl p-8 text-center">
				<p className="text-white/70 mb-2">Aún no hay recuerdos.</p>
				<p className="text-white/50 text-sm">Subí recuerdos y volvé para ver el recap.</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<p className="text-white/70 text-sm">
				{sorted.length} recuerdos. Nuestro año juntos.
			</p>
			<RecapSlideshow memories={sorted} />
		</div>
	)
}
