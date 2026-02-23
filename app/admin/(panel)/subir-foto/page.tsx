import SubirFotoForm from '@/components/admin/SubirFotoForm'

export default function SubirFotoPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
					Subir Recuerdo
				</h1>
				<p className="text-white/70 text-sm md:text-base">
					Sube una foto o video. Se publica directamente en el Collage para que todos lo vean.
				</p>
			</div>
			<SubirFotoForm />
		</div>
	)
}
