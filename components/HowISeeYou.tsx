'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
	'Mi paz', 'Mi suerte', 'Mi debilidad', 'Mi todo', 'Mi hogar', 'Mi calma',
	'Mi alegría', 'Mi razón', 'Mi complicidad', 'Mi refugio', 'Mi fuerza',
	'Mi luz', 'Mi tesoro', 'Mi vida', 'Mi amor', 'Mi confidente', 'Mi equipo',
	'Mi persona', 'Mi risa', 'Mi abrazo', 'Mi cómplice', 'Mi apoyo', 'Mi ancla',
]

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

function buildSingleConstellation(): Constellation {
	// Seleccionar 3 palabras aleatorias
	const shuffled = [...WORDS].sort(() => Math.random() - 0.5)
	const selectedWords = shuffled.slice(0, 3)

	const points: Point[] = selectedWords.map((word, index) => ({
		// Posiciones distribuidas triangularmente para que se vea bien
		x: index === 0 ? 50 : index === 1 ? 25 : 75,
		y: index === 0 ? 25 : 75,
		// Variación aleatoria
		word,
		index
	}))

	// Añadir aleatoriedad a las posiciones pero manteniendo estructura
	points.forEach(p => {
		p.x += (Math.random() - 0.5) * 30
		p.y += (Math.random() - 0.5) * 30
		// Clamp
		p.x = Math.max(15, Math.min(85, p.x))
		p.y = Math.max(15, Math.min(85, p.y))
	})

	// Conectar todos con todos para formar triángulo (o línea si queda así)
	const connections: [number, number][] = [
		[0, 1],
		[1, 2],
		[2, 0]
	]

	return { points, connections }
}

export default function HowISeeYou() {
	const [constellation, setConstellation] = useState<Constellation | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		setConstellation(buildSingleConstellation())
	}, [])

	if (!mounted || !constellation) return null

	return (
		<section className="py-32 md:py-48 px-6 relative z-10 overflow-hidden">
			<div className="max-w-4xl mx-auto">
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
						Una constelación única, como tú
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1 }}
					className="relative aspect-square max-w-md mx-auto w-full"
				>
					<svg
						className="w-full h-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="xMidYMid meet"
						style={{ overflow: 'visible' }}
					>
						{/* Conexiones */}
						{constellation.connections.map(([a, b], i) => {
							const p1 = constellation.points[a]
							const p2 = constellation.points[b]
							return (
								<motion.line
									key={`line-${i}`}
									x1={p1.x}
									y1={p1.y}
									x2={p2.x}
									y2={p2.y}
									stroke="rgba(167, 139, 250, 0.4)"
									strokeWidth="0.5"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{ pathLength: 1, opacity: 1 }}
									transition={{ duration: 1.5, delay: i * 0.3 }}
								/>
							)
						})}

						{/* Puntos y Textos */}
						{constellation.points.map((point, i) => (
							<g key={`p-${i}`}>
								{/* Estrella central */}
								<motion.circle
									cx={point.x}
									cy={point.y}
									r={1.5}
									fill="white"
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.5 + i * 0.2 }}
								/>
								{/* Halo */}
								<motion.circle
									cx={point.x}
									cy={point.y}
									r={6}
									fill="url(#glowGradient)"
									initial={{ scale: 0, opacity: 0 }}
									animate={{
										scale: [0.8, 1.2, 0.8],
										opacity: [0.3, 0.6, 0.3]
									}}
									transition={{
										delay: 0.5 + i * 0.2,
										repeat: Infinity,
										duration: 3
									}}
								/>

								{/* Texto */}
								<foreignObject
									x={point.x - 40}
									y={point.y + 4}
									width={80}
									height={30}
									style={{ overflow: 'visible' }}
								>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1 + i * 0.2 }}
										className="text-center font-display text-sm md:text-base text-white font-medium"
										style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
									>
										{point.word}
									</motion.div>
								</foreignObject>
							</g>
						))}

						<defs>
							<radialGradient id="glowGradient">
								<stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
								<stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
							</radialGradient>
						</defs>
					</svg>
				</motion.div>
			</div>
		</section>
	)
}
