import SubirFotoForm from '@/components/admin/SubirFotoForm'

export default function SubirFotoPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
					Subir foto diaria
				</h1>
				<p className="text-white/70 text-sm md:text-base">
					Una foto por día. Este momento queda guardado para siempre.
				</p>
			</div>
			<SubirFotoForm />
		</div>
	)
}
