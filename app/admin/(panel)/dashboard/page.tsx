import Link from 'next/link'
import { getSessionFromCookie } from '@/lib/auth-server'
import { getDailyMemoriesStats } from '@/lib/admin-db'

export default async function DashboardPage() {
	const session = await getSessionFromCookie()
	const stats = await getDailyMemoriesStats()

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
					Panel de Administración
				</h1>
				<p className="text-white/70 text-sm md:text-base">
					Hola, {session?.username}. Desde aquí podés gestionar los recuerdos del Collage.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<StatCard
					title="Fotos subidas"
					value={stats.totalPhotos}
					subtitle="en total"
				/>
				<StatCard
					title="Días activos"
					value={stats.activeDays}
					subtitle="con al menos una foto"
				/>
				<StatCard
					title="Este año"
					value={stats.photosThisYear}
					subtitle={new Date().getFullYear().toString()}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ActionCard
					href="/admin/subir-foto"
					title="Subir Recuerdo"
					description="Subí una foto o video. Se publica directamente en el Collage público."
					highlight
				/>
				<ActionCard
					href="/collage"
					title="Ver Collage"
					description="Mirá todos los recuerdos publicados. Desde ahí podés eliminar si es necesario."
				/>
				<ActionCard
					href="/admin/recuerdos"
					title="Historial de recuerdos"
					description="Ver todas las fotos subidas por fecha."
				/>
				<ActionCard
					href="/admin/recap"
					title="Recap anual"
					description="Recorré todas las fotos del año con una experiencia cinematográfica."
				/>
			</div>
		</div>
	)
}

function StatCard({
	title,
	value,
	subtitle,
}: {
	title: string
	value: number
	subtitle: string
}) {
	return (
		<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5">
			<p className="text-white/70 text-sm mb-1">{title}</p>
			<p className="font-display text-3xl font-bold text-white">{value}</p>
			<p className="text-white/50 text-xs mt-1">{subtitle}</p>
		</div>
	)
}

function ActionCard({
	href,
	title,
	description,
	className = '',
	highlight = false,
}: {
	href: string
	title: string
	description: string
	className?: string
	highlight?: boolean
}) {
	return (
		<Link
			href={href}
			className={`block backdrop-blur-md rounded-xl p-6 transition-all ${className} ${highlight
					? 'bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-400/30 hover:from-violet-500/30 hover:to-pink-500/30 hover:border-violet-400/50'
					: 'bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/25'
				}`}
		>
			<h2 className="font-display text-lg font-semibold text-white mb-2">{title}</h2>
			<p className="text-white/70 text-sm">{description}</p>
		</Link>
	)
}
