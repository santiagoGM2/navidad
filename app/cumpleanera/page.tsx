import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-constants'
import { parseSessionToken } from '@/lib/auth-server'
import BirthdayFlow from '@/components/fechas-especiales/BirthdayFlow'

export default function CumpleaneraPage() {
	const cookieStore = cookies()
	const token = cookieStore.get(COOKIE_NAME)?.value

	let isTefy = false
	if (token) {
		const session = parseSessionToken(token)
		if (session && session.username.toLowerCase() === 'tefy') {
			isTefy = true
		}
	}

	if (!isTefy) {
		return (
			<div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-slate-950 text-white relative z-50">
				<div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 text-center shadow-2xl">
					<div className="w-20 h-20 mx-auto bg-gradient-to-tr from-rose-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/20 mb-8 rotate-3">
						<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
					</div>
					<h1 className="font-display text-3xl font-bold text-white mb-3">Acceso Denegado</h1>
					<p className="text-white/60 text-sm mb-8">Esta sorpresa es exclusiva para la dueña de mi corazón.</p>
					<a href="/" className="inline-block py-3 px-6 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors">
						Volver al inicio
					</a>
				</div>
			</div>
		)
	}

	return <BirthdayFlow />
}
