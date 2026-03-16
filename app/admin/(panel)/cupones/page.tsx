import { getSessionFromCookie } from '@/lib/auth-server'
import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'

interface Coupon {
	id: string
	title: string
	description: string
	category: string
	is_redeemed: boolean
	redeemed_at: string | null
	created_at: string
}

const CATEGORY_LABELS: Record<string, string> = {
	date: 'Cita',
	pampering: 'Consentir',
	fun: 'Diversión',
	spicy: 'Picante',
	general: 'General',
}

const CATEGORY_COLORS: Record<string, string> = {
	date: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
	pampering: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
	fun: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
	spicy: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
	general: 'bg-white/10 text-white/60 border-white/20',
}

export default async function CouponsPage() {
	const session = getSessionFromCookie()

	let coupons: Coupon[] = []
	if (supabaseAdmin) {
		const { data } = await supabaseAdmin
			.from('birthday_coupons')
			.select('*')
			.eq('username', 'TeFy')
			.order('created_at', { ascending: true })
		coupons = (data ?? []) as Coupon[]
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-display text-3xl font-bold text-white mb-2">Cupones de TeFy</h1>
				<p className="text-white/60 text-sm">Regalos de cumpleaños exclusivos para la dueña del corazón.</p>
			</div>

			{coupons.length === 0 ? (
				<div className="backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl p-10 text-center">
					<p className="text-white/50 mb-2">No hay cupones guardados aún.</p>
					<Link href="/cumpleanera" className="text-pink-400 hover:text-pink-300 text-sm underline underline-offset-4">
						Ir a la página de cumpleaños para generarlos
					</Link>
				</div>
			) : (
				<>
					{/* Summary */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
							<p className="text-white/60 text-sm mb-1">Total</p>
							<p className="font-display text-3xl font-bold text-white">{coupons.length}</p>
						</div>
						<div className="backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
							<p className="text-white/60 text-sm mb-1">Disponibles</p>
							<p className="font-display text-3xl font-bold text-emerald-300">{coupons.filter(c => !c.is_redeemed).length}</p>
						</div>
						<div className="backdrop-blur-md bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
							<p className="text-white/60 text-sm mb-1">Canjeados</p>
							<p className="font-display text-3xl font-bold text-rose-300">{coupons.filter(c => c.is_redeemed).length}</p>
						</div>
						<div className="backdrop-blur-md bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
							<p className="text-white/60 text-sm mb-1">Usuario</p>
							<p className="font-display text-2xl font-bold text-pink-300">TeFy</p>
						</div>
					</div>

					{/* Coupon list */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{coupons.map(coupon => (
							<div
								key={coupon.id}
								className={`relative backdrop-blur-md border rounded-2xl p-5 flex gap-4 transition-all ${
									coupon.is_redeemed
										? 'bg-white/3 border-white/10 opacity-60'
										: 'bg-white/7 border-white/15 hover:bg-white/10'
								}`}
							>
								{/* Notch left */}
								<div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900" />
								<div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900" />

								<div className="flex-1">
									<div className="flex items-start justify-between gap-2 mb-1">
										<h3 className={`font-display font-bold transition-colors ${coupon.is_redeemed ? 'text-white/40 line-through' : 'text-white'}`}>
											{coupon.title}
										</h3>
										{coupon.is_redeemed && (
											<span className="flex-shrink-0 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
												Canjeado
											</span>
										)}
									</div>
									<p className="text-white/50 text-sm mb-3">{coupon.description}</p>
									<div className="flex items-center gap-2 flex-wrap">
										<span className={`text-xs border px-2.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[coupon.category] ?? CATEGORY_COLORS.general}`}>
											{CATEGORY_LABELS[coupon.category] ?? coupon.category}
										</span>
										<span className="text-white/30 text-xs font-mono">
											{new Date(coupon.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
										</span>
									</div>
									{coupon.redeemed_at && (
										<p className="text-rose-300/50 text-xs mt-1">
											Canjeado el {new Date(coupon.redeemed_at).toLocaleDateString('es')}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
