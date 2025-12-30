'use client'

import { motion } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import DepthTimeline from '@/components/DepthTimeline'
import HeartbeatLetter from '@/components/HeartbeatLetter'
import TimeCounter from '@/components/TimeCounter'
import DailyPhrase from '@/components/DailyPhrase'
import { MOMENTS } from '@/constants'

export default function Home() {
	return (
		<ConstellationBackground>
			<main className="w-full relative">

				{/* ═══════════════════════════════════════════════════════════
				    HERO SECTION — Primera Vista
				    UI minimalista sobre fondo de cielo claro
				═══════════════════════════════════════════════════════════ */}
				<section className="min-h-screen flex flex-col items-center justify-center px-6 relative">

					{/* Contenedor del Título Principal */}
					<motion.div
						className="text-center max-w-4xl mx-auto z-10"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						{/* Título Principal */}
						<motion.h1
							className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15]"
							style={{
								color: '#ffffff',
								textShadow: '0 0 40px rgba(255, 255, 255, 0.4)',
							}}
						>
							Recuerda que
							<br />
							<motion.span
								className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400"
								animate={{
									backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
								}}
								transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
								style={{ backgroundSize: '200% 200%' }}
							>
								si tú me amas,
							</motion.span>
							<br />
							yo te amo más.
						</motion.h1>

						{/* Subtítulo elegante */}
						<motion.p
							className="mt-10 md:mt-14 text-base sm:text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto leading-relaxed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, duration: 1.5 }}
							style={{
								color: 'rgba(255, 255, 255, 0.7)',
							}}
						>
							Un viaje a través de las estrellas,
							<br className="hidden sm:block" />
							<span className="sm:hidden"> </span>
							donde cada constelación guarda nuestra historia.
						</motion.p>
					</motion.div>
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    CONTADOR DE TIEMPO
				═══════════════════════════════════════════════════════════ */}
				<section className="py-32 md:py-40 px-6 relative z-10">
					<div className="max-w-4xl mx-auto">
						<TimeCounter />
					</div>
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    HISTORIA — Timeline
				═══════════════════════════════════════════════════════════ */}
				<div id="timeline" className="relative z-10">
					<DepthTimeline />
				</div>


				{/* ═══════════════════════════════════════════════════════════
				    MOMENTOS — Frases destacadas
				═══════════════════════════════════════════════════════════ */}
				<section id="moments" className="py-32 md:py-48 px-6 relative z-10">
					<div className="text-center mb-20">
						<motion.h2
							className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
							style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
						>
							Pequeños Instantes
						</motion.h2>
						<p className="text-white/50 text-base md:text-lg font-light">
							Susurros que las estrellas guardan para nosotros
						</p>
					</div>

					<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{MOMENTS.map((moment, i) => (
							<motion.div
								key={moment.id}
								className="group relative"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1, duration: 0.6 }}
								viewport={{ once: true }}
							>
								<div className="relative backdrop-blur-sm bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-500">
									<p className="font-display text-lg md:text-xl text-white/85 italic text-center leading-relaxed">
										&ldquo;{moment.text}&rdquo;
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    FRASE DEL DÍA
				═══════════════════════════════════════════════════════════ */}
				<section className="py-28 md:py-36 px-6 relative z-10">
					<div className="max-w-3xl mx-auto">
						<DailyPhrase />
					</div>
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    CARTA FINAL — El Tesoro
				═══════════════════════════════════════════════════════════ */}
				<section id="final" className="py-32 md:py-48 px-6 min-h-[80vh] flex flex-col justify-center items-center relative z-10">
					<motion.div
						className="w-full max-w-2xl text-center mb-12"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 1 }}
						viewport={{ once: true }}
					>
						<h2 className="font-display text-3xl md:text-5xl text-white font-bold mb-5">
							El Tesoro Final
						</h2>
						<p className="text-white/50 font-light">
							Si has llegado hasta aquí, es porque mereces saberlo todo.
						</p>
					</motion.div>
					<HeartbeatLetter />
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    FOOTER
				═══════════════════════════════════════════════════════════ */}
				<footer className="py-10 text-center text-white/25 text-sm relative z-10">
					<p>Hecho con amor eterno.</p>
				</footer>

			</main>
		</ConstellationBackground>
	)
}
