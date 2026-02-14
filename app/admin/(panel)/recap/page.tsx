import RecapView from '@/components/admin/RecapView'

export default function RecapPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
					Recap anual
				</h1>
				<p className="text-white/70 text-sm md:text-base">
					Recorré todas las fotos del año con una experiencia cinematográfica.
				</p>
			</div>
			<RecapView />
		</div>
	)
}
