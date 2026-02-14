'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
	'Mi paz',
	'Mi suerte',
	'Mi debilidad',
	'Mi todo',
	'Mi hogar',
	'Mi calma',
	'Mi alegría',
	'Mi razón',
	'Mi complicidad',
	'Mi refugio',
	'Mi fuerza',
	'Mi luz',
	'Mi tesoro',
	'Mi vida',
	'Mi amor',
	'Mi confidente',
	'Mi equipo',
	'Mi persona',
	'Mi risa',
	'Mi abrazo',
	'Mi cómplice',
	'Mi apoyo',
	'Mi ancla',
]

const CONSTELLATION_COUNT = 6
const WORDS_PER_CONSTELLATION = 3

interface Point {
	x: number
	y: number
	word: string
	index: number
}

interface Constellation {
	points: Point[]
	connections: [number, number][]
}

function buildConstellations(): Constellation[] {
	const result: Constellation[] = []
	const used = new Set<number>()
	const shuffled = [...WORDS].map((w, i) => ({ w, i }))
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	let wordIdx = 0

	for (let c = 0; c < CONSTELLATION_COUNT; c++) {
		const points: Point[] = []
		const take = WORDS_PER_CONSTELLATION
		for (let t = 0; t < take && wordIdx < shuffled.length; t++) {
			const { w, i } = shuffled[wordIdx++]
			points.push({
				x: 15 + Math.random() * 70,
				y: 15 + Math.random() * 70,
				word: w,
				index: points.length,
			})
		}
		if (points.length < 2) break
		const connections: [number, number][] = []
		for (let i = 0; i < points.length; i++) {
			for (let j = i + 1; j < points.length; j++) {
				if (Math.random() < 0.75) connections.push([i, j])
			}
		}
		if (connections.length === 0) connections.push([0, 1])
		result.push({ points, connections })
	}
	return result
}

export default function HowISeeYou() {
	const [constellations, setConstellations] = useState<Constellation[]>([])
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		setConstellations(buildConstellations())
	}, [])

	return (
		<section className="py-32 md:py-48 px-6 relative z-10 overflow-hidden">
			<div className="max-w-5xl mx-auto">
				<motion.div
					className="text-center mb-14 md:mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2
						className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
						style={{
							textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
						}}
					>
						Así te veo yo
					</h2>
					<p
						className="text-base md:text-lg font-light"
						style={{
							color: 'rgba(255, 255, 255, 0.85)',
							textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
						}}
					>
						Constelaciones que cambian cada vez
					</p>
				</motion.div>

				{!mounted ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[280px]" aria-hidden="true" />
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
						{constellations.map((constellation, cIdx) => (
							<motion.div
								key={cIdx}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: cIdx * 0.08, duration: 0.5 }}
								className="relative aspect-[1.1] max-w-sm mx-auto w-full"
							>
								<svg
									className="w-full h-full"
									viewBox="0 0 100 100"
									preserveAspectRatio="xMidYMid meet"
									style={{ overflow: 'visible' }}
								>
									{constellation.connections.map(([a, b], i) => {
										const p1 = constellation.points[a]
										const p2 = constellation.points[b]
										if (!p1 || !p2) return null
										return (
											<motion.line
												key={`line-${cIdx}-${i}`}
												x1={p1.x}
												y1={p1.y}
												x2={p2.x}
												y2={p2.y}
												stroke="rgba(167, 139, 250, 0.5)"
												strokeWidth="0.4"
												initial={{ pathLength: 0, opacity: 0 }}
												animate={{ pathLength: 1, opacity: 1 }}
												transition={{ duration: 0.8, delay: cIdx * 0.08 + i * 0.06 }}
											/>
										)
									})}
									{constellation.points.map((point, pIdx) => (
										<g key={`p-${cIdx}-${pIdx}`}>
											<motion.circle
												cx={point.x}
												cy={point.y}
												r={2.2}
												fill="rgba(255,255,255,0.95)"
												initial={{ scale: 0, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{
													delay: cIdx * 0.08 + 0.2 + pIdx * 0.05,
													type: 'spring',
													stiffness: 200,
													damping: 18,
												}}
											/>
											<foreignObject
												x={point.x - 28}
												y={point.y - 8}
												width={56}
												height={20}
												style={{ overflow: 'visible' }}
											>
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: cIdx * 0.08 + 0.35 + pIdx * 0.05 }}
													className="text-center text-[10px] md:text-xs font-display font-medium leading-tight w-full h-full flex items-center justify-center"
													style={{
														color: 'rgba(255, 255, 255, 0.95)',
														textShadow: '0 1px 4px rgba(0,0,0,0.6)',
													}}
												>
													{point.word}
												</motion.div>
											</foreignObject>
										</g>
									))}
								</svg>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
