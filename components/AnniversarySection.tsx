'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import AnniversaryFlowerIntro from '@/components/anniversary/AnniversaryFlowerIntro'
import AnniversaryHub from '@/components/anniversary/AnniversaryHub'

type Step = 'entry' | 'flower-intro' | 'hub'

// Soft floating particles for ambient effect
function FloatingParticles() {
	const particles = useMemo(
		() =>
			Array.from({ length: 18 }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				delay: Math.random() * 5,
				duration: 10 + Math.random() * 6,
				size: 4 + Math.random() * 6,
				opacity: 0.12 + Math.random() * 0.18,
				drift: (Math.random() - 0.5) * 60,
			})),
		[]
	)

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute rounded-full bg-rose-300/40"
					style={{
						left: `${p.x}%`,
						top: '100%',
						width: p.size,
						height: p.size,
						opacity: p.opacity,
					}}
					animate={{
						y: [-20, -1000],
						x: [0, p.drift],
						opacity: [p.opacity, 0],
					}}
					transition={{
						duration: p.duration,
						repeat: Infinity,
						delay: p.delay,
						ease: 'linear',
					}}
				/>
			))}
		</div>
	)
}

export default function AnniversarySection() {
	const [step, setStep] = useState<Step>('entry')
	const reduceMotion = useReducedMotion()

	const openSurprise = () => setStep('flower-intro')
	const goToHub = () => setStep('hub')

	return (
		<>
			{/* Full-screen flower intro overlay */}
			<AnimatePresence>
				{step === 'flower-intro' && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
						className="fixed inset-0 z-[99]"
					>
						<AnniversaryFlowerIntro onContinue={goToHub} />
					</motion.div>
				)}
			</AnimatePresence>

			<section
				id="anniversary"
				className="relative py-24 md:py-32 px-4 md:px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden"
				aria-labelledby="anniversary-heading"
			>
				{/* Dark elegant background */}
				<div
					className="absolute inset-0 z-0"
					style={{
						background: 'linear-gradient(180deg, #0f0a15 0%, #1a0f2e 40%, #1e1b4b 100%)',
						boxShadow: 'inset 0 0 120px rgba(139, 92, 246, 0.08), inset 0 0 60px rgba(236, 72, 153, 0.05)',
					}}
				/>
				<div
					className="absolute inset-0 z-0 opacity-60"
					style={{
						background:
							'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)',
					}}
				/>

				{!reduceMotion && <FloatingParticles />}

				<div className="relative z-10 w-full max-w-2xl mx-auto text-center">
					<AnimatePresence mode="wait">
						{step === 'entry' && (
							<motion.div
								key="entry"
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.98 }}
								transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
								className="space-y-10"
							>
								{/* Section title */}
								<div>
									<p
										className="text-sm md:text-base uppercase tracking-[0.3em] mb-3"
										style={{ color: 'rgba(255, 255, 255, 0.6)' }}
									>
										6 de febrero de 2026
									</p>
									<h2
										id="anniversary-heading"
										className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white"
										style={{
											textShadow: '0 2px 24px rgba(0,0,0,0.4), 0 0 48px rgba(139, 92, 246, 0.25)',
										}}
									>
										10 meses
									</h2>
									<p
										className="mt-3 text-base md:text-lg font-light max-w-md mx-auto"
										style={{ color: 'rgba(255, 255, 255, 0.85)' }}
									>
										Un capítulo más de nuestra historia
									</p>
								</div>

								{/* Entry card — click to open surprise */}
								<motion.button
									type="button"
									onClick={openSurprise}
									className="w-full max-w-md mx-auto block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e] rounded-2xl"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									aria-label="Abrir sorpresa de 10 meses"
								>
									<motion.div
										className="relative backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/25 bg-white/10 shadow-2xl"
										style={{
											boxShadow:
												'0 0 60px rgba(139, 92, 246, 0.15), 0 0 24px rgba(236, 72, 153, 0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
										}}
									>
										<p className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center leading-relaxed" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
											Feliz 10 meses mi princesa 💐
										</p>
										<p className="mt-4 text-sm text-white/70 text-center">
											Toca para abrir
										</p>
									</motion.div>
								</motion.button>
							</motion.div>
						)}

						{step === 'hub' && (
							<motion.div
								key="hub"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
								className="w-full"
							>
								<p
									className="text-sm md:text-base uppercase tracking-[0.2em] mb-6"
									style={{ color: 'rgba(255, 255, 255, 0.6)' }}
								>
									Tu espacio especial
								</p>
								<AnniversaryHub />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</section>
		</>
	)
}
