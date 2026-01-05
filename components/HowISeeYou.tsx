'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
	'Valiente',
	'Hermosa',
	'Hogar',
	'Luz',
	'Calma',
	'Amor',
	'Fuerza',
	'Esperanza',
	'Belleza',
	'Corazón',
	'Ternura',
	'Felicidad',
	'Inspiración',
	'Paz',
	'Magia'
]

interface ConstellationPoint {
	id: number
	x: number
	y: number
	word: string
	connections: number[]
}

/**
 * Componente "Así te veo yo" - Constelación dinámica con palabras
 * Cada refresh cambia las palabras y el patrón
 */
export default function HowISeeYou() {
	const [selectedWords, setSelectedWords] = useState<string[]>([])
	const [constellation, setConstellation] = useState<ConstellationPoint[]>([])

	// Seleccionar 3-4 palabras al azar en cada render
	useEffect(() => {
		const shuffled = [...WORDS].sort(() => Math.random() - 0.5)
		const count = Math.floor(Math.random() * 2) + 3 // 3 o 4 palabras
		setSelectedWords(shuffled.slice(0, count))
	}, [])

	// Generar constelación única basada en las palabras seleccionadas
	useEffect(() => {
		if (selectedWords.length === 0) return

		const points: ConstellationPoint[] = selectedWords.map((word, index) => {
			// Distribución circular elegante con radio más consistente
			const angle = (index / selectedWords.length) * Math.PI * 2
			// Radio más controlado para evitar que las palabras se salgan
			const radius = selectedWords.length === 3 ? 28 : 32
			const centerX = 50
			const centerY = 50

			return {
				id: index,
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius,
				word,
				connections: []
			}
		})

		// Conectar puntos para formar constelación única
		points.forEach((point, index) => {
			// Conectar con el siguiente y algunos aleatorios
			const nextIndex = (index + 1) % points.length
			point.connections.push(nextIndex)

			// Conexiones aleatorias adicionales (30% probabilidad)
			points.forEach((other, otherIndex) => {
				if (otherIndex !== index && otherIndex !== nextIndex && Math.random() < 0.3) {
					point.connections.push(otherIndex)
				}
			})
		})

		setConstellation(points)
	}, [selectedWords])

	return (
		<section className="py-32 md:py-48 px-6 relative z-10">
			<div className="max-w-4xl mx-auto">
				{/* Título */}
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2 
						className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
						style={{ 
							textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
						}}
					>
						Así te veo yo...
					</h2>
					<p 
						className="text-base md:text-lg font-light"
						style={{ 
							color: 'rgba(255, 255, 255, 0.85)',
							textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
						}}
					>
						Una constelación única que cambia cada vez
					</p>
				</motion.div>

				{/* Constelación */}
				<motion.div
					className="relative w-full aspect-square max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, ease: 'easeOut' }}
					viewport={{ once: true }}
				>
					<svg
						className="w-full h-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="xMidYMid meet"
						style={{ overflow: 'visible' }}
					>
						{/* Líneas de conexión */}
						{constellation.map((point) =>
							point.connections.map((targetId, i) => {
								const target = constellation.find(p => p.id === targetId)
								if (!target) return null

								return (
									<motion.line
										key={`line-${point.id}-${target.id}-${i}`}
										x1={point.x}
										y1={point.y}
										x2={target.x}
										y2={target.y}
										stroke="rgba(139, 92, 246, 0.4)"
										strokeWidth="0.2"
										initial={{ pathLength: 0, opacity: 0 }}
										animate={{ pathLength: 1, opacity: 1 }}
										transition={{ 
											duration: 1.5,
											delay: i * 0.1,
											ease: 'easeInOut'
										}}
									/>
								)
							})
						)}

						{/* Estrellas con palabras */}
						{constellation.map((point, index) => (
							<g key={point.id}>
								{/* Estrella */}
								<motion.circle
									cx={point.x}
									cy={point.y}
									r="1.5"
									fill="white"
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ 
										duration: 0.5,
										delay: index * 0.2,
										type: 'spring'
									}}
								>
									<animate
										attributeName="opacity"
										values="0.6;1;0.6"
										dur="3s"
										repeatCount="indefinite"
										begin={`${index * 0.3}s`}
									/>
								</motion.circle>

								{/* Palabra - Usar foreignObject para mejor renderizado */}
								<foreignObject
									x={point.x - 40}
									y={point.y - 12}
									width="80"
									height="24"
								>
									<motion.div
										initial={{ opacity: 0, y: 4 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ 
											duration: 0.8,
											delay: index * 0.2 + 0.5
										}}
										className="text-center flex items-center justify-center"
										style={{ 
											color: 'rgba(255, 255, 255, 0.95)',
											fontFamily: 'var(--font-playfair)',
											fontSize: 'clamp(0.75rem, 1vw, 1rem)',
											fontWeight: 500,
											lineHeight: '1.3',
											letterSpacing: '0.02em',
											textShadow: '0 2px 4px rgba(0, 0, 0, 0.7), 0 0 8px rgba(139, 92, 246, 0.3)',
											whiteSpace: 'nowrap',
											overflow: 'visible',
											width: '100%',
											height: '100%',
											padding: '2px 4px'
										}}
									>
										{point.word}
									</motion.div>
								</foreignObject>
							</g>
						))}
					</svg>
				</motion.div>

				{/* Instrucción sutil */}
				<motion.p
					className="text-center mt-8 text-sm"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 1 }}
					viewport={{ once: true }}
					style={{ 
						color: 'rgba(255, 255, 255, 0.6)',
						fontStyle: 'italic'
					}}
				>
					Recarga la página para ver una constelación diferente
				</motion.p>
			</div>
		</section>
	)
}

