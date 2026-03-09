'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ConstellationBackground from '@/components/ConstellationBackground'
import { saveScrollPosition } from '@/components/ScrollRestore'
import TimeCounter from '@/components/TimeCounter'
import EmotionalDailyPhrase from '@/components/EmotionalDailyPhrase'
import GlobalInteractions from '@/components/GlobalInteractions'
import SectionEffects from '@/components/SectionEffects'
import { MOMENTS } from '@/constants'
import DepthTimeline from '@/components/DepthTimeline'
import HeartbeatLetter from '@/components/HeartbeatLetter'
import SealedLetters from '@/components/SealedLetters'
import HowISeeYou from '@/components/HowISeeYou'
import AnniversarySection from '@/components/AnniversarySection'
import { useAhorroProgress } from '@/hooks/useAhorroProgress'

export default function Home() {
	const pathname = usePathname()
	const { data: ahorro } = useAhorroProgress()
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
							<Link href="/collage" onClick={() => pathname && saveScrollPosition(pathname)}>
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
				    NUESTRO AHORRO — Preview / CTA
				═══════════════════════════════════════════════════════════ */}
				<section className="py-20 md:py-28 px-6 relative z-10">
					<div className="max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
							viewport={{ once: true }}
						>
							{/* Separador */}
							<div
								className="mb-12 h-px w-full"
								style={{ background: 'linear-gradient(to right, transparent, #4F46E5, transparent)' }}
							/>

							{/* Encabezado */}
							<div className="text-center mb-10">
								<p className="text-xs uppercase tracking-[0.3em] font-semibold mb-3" style={{ color: '#818CF8' }}>
									El viaje de nuestra vida
								</p>
								<h2
									className="font-display text-3xl md:text-5xl font-bold text-white mb-4"
									style={{ textShadow: '0 0 40px rgba(79,70,229,0.4)' }}
								>
									Nos vamos a Europa
								</h2>
								<p className="text-base font-light" style={{ color: 'rgba(255,255,255,0.6)' }}>
									Día a día construimos el camino hacia nuestro primer viaje juntos
								</p>
							</div>

							{/* Card principal */}
							<Link href="/ahorros">
								<motion.div
									whileHover={{ scale: 1.015, y: -2 }}
									whileTap={{ scale: 0.99 }}
									className="relative overflow-hidden rounded-3xl cursor-pointer"
									style={{
										background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(30,27,75,0.4) 50%, rgba(79,70,229,0.08) 100%)',
										border: '1px solid rgba(79,70,229,0.35)',
										boxShadow: '0 0 60px rgba(79,70,229,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
									}}
								>
									{/* Brillo decorativo superior */}
									<div
										className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
										style={{ background: 'linear-gradient(to right, transparent, rgba(129,140,248,0.6), transparent)' }}
									/>

									<div className="p-8 md:p-10">
										{/* Barra de progreso */}
										<div className="mb-8">
											<div className="flex justify-between items-baseline mb-2">
												<span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#818CF8' }}>
													Progreso
												</span>
												<span className="text-sm font-bold" style={{ color: '#818CF8' }}>
													{ahorro.porcentaje.toFixed(1)}%
												</span>
											</div>
											<div
												className="h-1.5 w-full rounded-full"
												style={{ background: 'rgba(255,255,255,0.08)' }}
											>
												<motion.div
													className="h-1.5 rounded-full"
													style={{
														background: 'linear-gradient(to right, #4F46E5, #818CF8)',
														boxShadow: '0 0 10px rgba(79,70,229,0.6)',
													}}
													initial={{ width: 0 }}
													whileInView={{ width: `${Math.min(ahorro.porcentaje, 100)}%` }}
													transition={{ duration: 1.2, ease: 'easeOut' }}
													viewport={{ once: true }}
												/>
											</div>
										</div>

										{/* Stats row */}
										<div className="grid grid-cols-3 gap-4 mb-8">
											{[
												{ label: 'Meta', value: '$ 2.000.000', color: 'rgba(255,255,255,0.9)' },
												{
													label: 'Ya tenemos',
													value: '$ ' + ahorro.ahorrado.toLocaleString('es-CO'),
													color: '#10B981',
												},
												{
													label: 'Días marcados',
													value: `${ahorro.dias_listos} de 80`,
													color: 'rgba(255,255,255,0.9)',
												},
											].map((stat) => (
												<div key={stat.label} className="text-center">
													<p
														className="text-xs uppercase tracking-widest mb-1.5 font-semibold"
														style={{ color: 'rgba(129,140,248,0.7)' }}
													>
														{stat.label}
													</p>
													<p className="text-lg md:text-xl font-bold leading-tight" style={{ color: stat.color }}>
														{stat.value}
													</p>
												</div>
											))}
										</div>

										{/* CTA */}
										<div className="flex items-center justify-between">
											<p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>
												Actualización en tiempo real
											</p>
											<div
												className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
												style={{
													background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
													color: 'white',
													boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
												}}
											>
												Ver progreso
												<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
												</svg>
											</div>
										</div>
									</div>
								</motion.div>
							</Link>
						</motion.div>
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
				    CARTAS CERRADAS EN EL TIEMPO
				═══════════════════════════════════════════════════════════ */}
				<SealedLetters />

				{/* ═══════════════════════════════════════════════════════════
				    JUEGOS — Enlace a /juegos
				═══════════════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 px-6 relative z-10">
					<div className="max-w-5xl mx-auto">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<Link
								href="/juegos"
								onClick={() => pathname && saveScrollPosition(pathname)}
								className="block w-full group relative"
							>
								{/* Glow effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-3xl" />

								<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl p-10 md:p-16 text-center transition-all duration-500 group-hover:border-blue-400/30 group-hover:bg-white/10 group-hover:-translate-y-1 shadow-2xl shadow-black/20">

									{/* Decorative background elements inside card */}
									<div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
									<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

									<div className="relative z-10 flex flex-col items-center">
										<div className="mb-6 w-16 h-16 md:w-20 md:h-20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 inline-block text-white">
											<svg fill="currentColor" viewBox="0 0 24 24">
												<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
											</svg>
										</div>

										<h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
											style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
											Nuestra Zona de Juegos
										</h2>

										<p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
											Un espacio especial donde la diversión y nuestros retos se encuentran.
											¿Estás lista para jugar?
										</p>

										<span className="inline-flex items-center gap-3 py-4 px-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
											Entrar a jugar
											<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</span>
									</div>
								</div>
							</Link>
						</motion.div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════════════
				    10 MESES — Aniversario especial
				═══════════════════════════════════════════════════════════ */}
				<AnniversarySection />


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
