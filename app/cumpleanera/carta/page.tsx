import { getSessionFromCookie } from '@/lib/auth-server'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CartaCumpleanera() {
	const session = getSessionFromCookie()

	if (session?.username.toLowerCase() !== 'tefy') {
		return (
			<div className="min-h-[100dvh] bg-zinc-950 text-white flex items-center justify-center p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-rose-500 mb-3">Acceso Denegado</h1>
					<p className="text-white/60">Esta carta es confidencial y exclusiva para TeFy.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-[100dvh] bg-gradient-to-br from-rose-900 via-pink-900 to-indigo-950 text-white p-4 py-12 md:p-8 md:py-16 flex flex-col items-center relative overflow-hidden">
			
			{/* Decoración de fondo flotante */}
			<div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🎂</div>
			<div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-bounce">🎈</div>
			<div className="absolute top-40 right-20 text-4xl opacity-20 animate-pulse">✨</div>
			<div className="absolute bottom-40 left-10 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>💖</div>

			<div className="max-w-2xl w-full z-10">
				
				{/* Foto tipo Polaroid */}
				<div className="w-full flex justify-center mb-10 md:mb-14 relative z-20">
					<div className="relative w-64 h-72 md:w-80 md:h-[350px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
						<div className="absolute inset-0 bg-white p-3 md:p-4 pb-16 md:pb-20 rounded-sm flex flex-col">
							<div className="relative w-full flex-1 overflow-hidden bg-zinc-100 rounded-sm">
								<Image
									src="/images/us-kids.png"
									alt="Nosotros"
									fill
									className="object-cover object-top"
									sizes="(max-width: 768px) 256px, 320px"
									priority
								/>
							</div>
							<p className="absolute bottom-4 md:bottom-6 left-0 right-0 text-center text-slate-800 font-display font-medium text-xl md:text-2xl transform -rotate-2">
								TeFy & Yo 💖
							</p>
						</div>
					</div>
				</div>

				{/* Carta Content */}
				<div className="bg-white/10 backdrop-blur-xl p-8 md:p-14 rounded-[2.5rem] shadow-2xl border border-white/20 relative">
					
					{/* Tape decorations */}
					<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/20 backdrop-blur-md transform -rotate-2 shadow-sm rounded-sm z-30 opacity-70"></div>

					<h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400 mb-8 text-center leading-tight">
						¡Feliz Cumpleaños,<br/>Mi Amor!
					</h1>

					<div className="space-y-6 text-lg md:text-xl leading-relaxed text-pink-50 font-light drop-shadow-sm">
						<p>
							Mi cachetona hermosa,
						</p>
						<p>
							Hoy es un día inmensamente especial. Celebramos tu vida, tu esencia, y la increíble persona que eres. 
							Cada momento a tu lado es mi regalo favorito, y quería asegurarme de que este cumpleaños fuera una sorpresa tan única y especial como tú.
						</p>
						<p>
							Espero que hayas disfrutado este jueguito de los cupones y los regalos escurridizos. 
							¡Ahora tienes un montón de cosas para cobrarme! Prometo cumplirlas todas con todo el amor del mundo.
						</p>
						<p>
							Que este nuevo año de vida esté lleno de alegrías gigantes, sueños cumplidos, demasiadas sonrisas 
							y sobre todo, que sigamos construyendo nuestra historia de amor juntos. Eres mi mayor orgullo 
							y la dueña absoluta de mi corazón.
						</p>
						<p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 pt-4">
							Te amo desde siempre y para siempre, infinitamente y un poquito más.
						</p>
					</div>
					
					<div className="mt-14 pt-8 border-t border-white/10 text-center">
						<Link href="/cumpleanera" className="inline-block py-4 px-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all">
							Volver al inicio
						</Link>
					</div>
				</div>

			</div>
		</div>
	)
}
