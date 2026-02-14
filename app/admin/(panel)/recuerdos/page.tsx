import RecuerdosList from '@/components/admin/RecuerdosList'

export default function RecuerdosPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
					Panel de recuerdos
				</h1>
				<p className="text-white/70 text-sm md:text-base">
					Todas las fotos subidas, ordenadas por fecha.
				</p>
			</div>
			<RecuerdosList />
		</div>
	)
}
