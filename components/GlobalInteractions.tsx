'use client'

import { motion } from 'framer-motion'
import { useMouseInteraction } from '@/hooks/useMouseInteraction'

/**
 * Componente global para interacciones sutiles con el mouse/touch
 * Corazones que siguen el cursor y estrellitas al hacer click
 */
export default function GlobalInteractions() {
	const { hearts, stars } = useMouseInteraction()

	return (
		<>
			{/* Corazones que siguen el cursor */}
			{hearts.map((heart) => (
				<motion.div
					key={heart.id}
					className="fixed pointer-events-none z-[100]"
					style={{
						left: heart.x - 12,
						top: heart.y - 12,
					}}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ 
						scale: [0, 1, 0.8],
						opacity: [0, 0.6, 0.4],
						rotate: [0, 15, -15, 0]
					}}
					transition={{ 
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
				>
					<svg className="w-6 h-6 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				</motion.div>
			))}

			{/* Estrellitas al hacer click */}
			{stars.map((star) => {
				const progress = star.life / star.maxLife
				const size = 4 * (1 - progress)
				const opacity = 1 - progress

				return (
					<motion.div
						key={star.id}
						className="fixed pointer-events-none z-[100]"
						style={{
							left: star.x,
							top: star.y,
							width: size,
							height: size,
						}}
						initial={{ scale: 0, opacity: 1 }}
						animate={{ 
							scale: [0, 1.5, 0],
							opacity: [1, opacity, 0],
							y: star.y - 50,
							rotate: 360
						}}
						transition={{ 
							duration: 1,
							ease: 'easeOut'
						}}
					>
						<svg className="w-full h-full text-amber-300" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
						</svg>
					</motion.div>
				)
			})}
		</>
	)
}

