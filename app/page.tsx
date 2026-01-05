'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ConstellationBackground from '@/components/ConstellationBackground'
import TimeCounter from '@/components/TimeCounter'
import EmotionalDailyPhrase from '@/components/EmotionalDailyPhrase'
import GlobalInteractions from '@/components/GlobalInteractions'
import SectionEffects from '@/components/SectionEffects'
import { MOMENTS } from '@/constants'
import DepthTimeline from '@/components/DepthTimeline'
import HeartbeatLetter from '@/components/HeartbeatLetter'
import SealedLetters from '@/components/SealedLetters'
import HowISeeYou from '@/components/HowISeeYou'
import UnlockableHeart from '@/components/UnlockableHeart'

export default function Home() {
	return (
		<ConstellationBackground>
			{/* Interacciones globales */}
			<GlobalInteractions />

			<main className="w-full relative">

				{/* ═══════════════════════════════════════════════════════════
				    HERO SECTION — Primera Vista (LCP Element)
				    UI minimalista sobre fondo de cielo claro
				═══════════════════════════════════════════════════════════ */}
				<section className="min-h-screen flex flex-col items-center justify-center px-6 relative">

					{/* Contenedor del Título Principal - LCP Element */}
					<motion.div
						className="text-center max-w-4xl mx-auto z-10"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						{/* Título Principal - Prioridad LCP */}
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

						{/* Subtítulo elegante - Contraste mejorado para WCAG AA */}
						<motion.p
							className="mt-10 md:mt-14 text-base sm:text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto leading-relaxed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, duration: 1.5 }}
							style={{
								color: 'rgba(255, 255, 255, 0.95)', // Mejorado de 0.7 a 0.95 para contraste ≥ 4.5:1
								textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)', // Sombra para mejor legibilidad
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
				    BOTÓN DE TRANSICIÓN — Collage
				═══════════════════════════════════════════════════════════ */}
				<section className="py-16 md:py-24 px-6 relative z-10">
					<div className="max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: 'easeOut' }}
							viewport={{ once: true }}
							className="w-full"
						>
							<Link href="/collage">
								<motion.button
									className="w-full py-6 md:py-8 px-8 md:px-12 rounded-full bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 relative overflow-hidden group"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									{/* Efecto de brillo al hover */}
									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
										initial={{ x: '-100%' }}
										whileHover={{ x: '100%' }}
										transition={{ duration: 0.6 }}
									/>
									
									<span 
										className="relative z-10 font-display text-lg md:text-xl lg:text-2xl font-semibold text-white"
										style={{ 
											textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
										}}
									>
										Conoce más esta historia de amor
									</span>
								</motion.button>
							</Link>
						</motion.div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════════════
				    MOMENTOS — Frases destacadas
				═══════════════════════════════════════════════════════════ */}
				<section id="moments" className="py-32 md:py-48 px-6 relative z-10">
					{/* Efectos de partículas para recuerdos */}
					<SectionEffects sectionId="moments" effectType="particles" />
					<div className="text-center mb-20">
						<motion.h2
							className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
							style={{
								textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)' // Mejor contraste
							}}
						>
							Pequeños Instantes
						</motion.h2>
						<p
							className="text-base md:text-lg font-light"
							style={{
								color: 'rgba(255, 255, 255, 0.85)', // Mejorado de 0.5 a 0.85 para contraste ≥ 4.5:1
								textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
							}}
						>
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
								<div className="relative backdrop-blur-sm bg-white/10 border border-white/20 p-6 md:p-8 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-500">
									<p
										className="font-display text-lg md:text-xl italic text-center leading-relaxed"
										style={{
											color: 'rgba(255, 255, 255, 0.95)', // Mejorado para contraste ≥ 4.5:1
											textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
										}}
									>
										&ldquo;{moment.text}&rdquo;
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    FRASE DEL DÍA (CON ESTADO EMOCIONAL)
				═══════════════════════════════════════════════════════════ */}
				<section className="py-28 md:py-36 px-6 relative z-10">
					<div className="max-w-3xl mx-auto">
						<EmotionalDailyPhrase />
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════════════
				    ASÍ TE VEO YO — Constelación Dinámica
				═══════════════════════════════════════════════════════════ */}
				<HowISeeYou />

				{/* ═══════════════════════════════════════════════════════════
				    CARTAS SELLADAS EN EL TIEMPO
				═══════════════════════════════════════════════════════════ */}
				<SealedLetters />

				{/* ═══════════════════════════════════════════════════════════
				    RETO DEL CORAZÓN
				═══════════════════════════════════════════════════════════ */}
				<UnlockableHeart />


				{/* ═══════════════════════════════════════════════════════════
				    CARTA FINAL — El Tesoro
				═══════════════════════════════════════════════════════════ */}
				<section id="final" className="py-32 md:py-48 px-6 min-h-[80vh] flex flex-col justify-center items-center relative z-10">
					{/* Efectos elegantes para carta final */}
					<SectionEffects sectionId="final" effectType="elegant" />
					<motion.div
						className="w-full max-w-2xl text-center mb-12"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 1 }}
						viewport={{ once: true }}
					>
						<h2
							className="font-display text-3xl md:text-5xl text-white font-bold mb-5"
							style={{
								textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
							}}
						>
							El Tesoro Final
						</h2>
						<p
							className="font-light"
							style={{
								color: 'rgba(255, 255, 255, 0.85)', // Mejorado para contraste ≥ 4.5:1
								textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
							}}
						>
							Si has llegado hasta aquí, es porque mereces saberlo todo.
						</p>
					</motion.div>
					<HeartbeatLetter />
				</section>


				{/* ═══════════════════════════════════════════════════════════
				    FOOTER
				═══════════════════════════════════════════════════════════ */}
				<footer
					className="py-10 text-center text-sm relative z-10"
					style={{
						color: 'rgba(255, 255, 255, 0.6)', // Mejorado de 0.25 a 0.6 para mejor legibilidad
						textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
					}}
				>
					<p>Hecho con amor eterno.</p>
				</footer>

			</main>
		</ConstellationBackground>
	)
}
