'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { saveScrollPosition } from '@/components/ScrollRestore'

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
	const reduceMotion = useReducedMotion()
	const pathname = usePathname()

	return (
		<section
			id="anniversary"
			className="relative py-24 md:py-32 px-4 md:px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden"
			aria-labelledby="anniversary-heading"
		>
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
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
					className="space-y-10"
				>
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

					<Link
						href="/10-meses"
						onClick={() => pathname && saveScrollPosition(pathname)}
						className="w-full max-w-md mx-auto block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e] rounded-2xl"
						aria-label="Ir al espacio de 10 meses"
					>
						<motion.div
							className="relative backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/25 bg-white/10 shadow-2xl"
							style={{
								boxShadow:
									'0 0 60px rgba(139, 92, 246, 0.15), 0 0 24px rgba(236, 72, 153, 0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
							}}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<p
								className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center leading-relaxed"
								style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
							>
								Feliz 10 meses mi princesa
							</p>
							<p className="mt-4 text-sm text-white/70 text-center">
								Toca para abrir
							</p>
						</motion.div>
					</Link>
				</motion.div>
			</div>
		</section>
	)
}
