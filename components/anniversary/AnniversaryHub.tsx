'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ANNIVERSARY_LETTER } from '@/constants/anniversary'
import QuienEsMasGame from './QuienEsMasGame'

function HubPetals({ reduceMotion }: { reduceMotion: boolean | null }) {
	const petals = useMemo(
		() =>
			Array.from({ length: 10 }, (_, i) => ({
				id: i,
				left: Math.random() * 100,
				delay: Math.random() * 4,
				duration: 12 + Math.random() * 6,
				size: 8 + Math.random() * 10,
				opacity: 0.2 + Math.random() * 0.15,
			})),
		[]
	)
	if (reduceMotion) return null
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
			{petals.map((p) => (
				<motion.div
					key={p.id}
					className="absolute rounded-full bg-rose-300/50"
					style={{
						left: `${p.left}%`,
						top: -20,
						width: p.size,
						height: p.size * 1.2,
						opacity: p.opacity,
						borderRadius: '50% 50% 50% 0',
						transform: 'rotate(-30deg)',
					}}
					animate={{
						y: [0, 1100],
						x: [0, (Math.random() - 0.5) * 100],
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

export default function AnniversaryHub() {
	const reduceMotion = useReducedMotion()

	return (
		<div className="relative space-y-20 md:space-y-24">
			<HubPetals reduceMotion={reduceMotion ?? null} />

			<section aria-labelledby="letter-heading">
				<motion.div
					key="letter"
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
					className="max-w-xl mx-auto"
				>
					<motion.div
						className="relative backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 bg-gradient-to-br from-amber-50/95 to-white/95 shadow-2xl"
						style={{
							color: '#78350f',
							boxShadow: '0 0 60px rgba(251, 191, 36, 0.12), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
						}}
					>
						<motion.h2
							id="letter-heading"
							className="font-display text-2xl md:text-3xl font-semibold text-amber-900 mb-6 text-center"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15 }}
						>
							{ANNIVERSARY_LETTER.title}
						</motion.h2>

						<motion.div
							className="prose prose-amber max-w-none text-left"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<p className="text-amber-900/90 leading-relaxed whitespace-pre-line text-base md:text-lg font-serif">
								{ANNIVERSARY_LETTER.content}
							</p>
						</motion.div>
					</motion.div>
				</motion.div>
			</section>

			<section
				className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-8 md:p-10 max-w-2xl mx-auto"
				aria-labelledby="game-heading"
			>
				<div id="game-heading" className="sr-only">
					Quien es mas
				</div>
				<QuienEsMasGame />
			</section>
		</div>
	)
}
