import { listDailyMemories } from '@/lib/admin-db'
import RecapSlideshow from './RecapSlideshow'

export default async function RecapView() {
	const year = new Date().getFullYear()
	const memories = await listDailyMemories({ year, limit: 500 })
	const sorted = [...memories].sort(
		(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	)

	if (sorted.length === 0) {
		return (
			<div className="backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl p-8 text-center">
				<p className="text-white/70 mb-2">Aún no hay fotos de {year}.</p>
				<p className="text-white/50 text-sm">Subí fotos diarias y volvé para ver el recap.</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<p className="text-white/70 text-sm">
				{sorted.length} fotos en {year}. Nuestro año juntos.
			</p>
			<RecapSlideshow memories={sorted} year={year} />
		</div>
	)
}
