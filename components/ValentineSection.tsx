'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ValentineSection() {
	return (
		<section
			id="san-valentin"
			className="relative py-32 md:py-40 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden"
		>
			{/* Fondo romántico */}
			<div
				className="absolute inset-0 z-0"
				style={{
					background: 'linear-gradient(180deg, #1a0f2e 0%, #2d1b3d 40%, #4a1942 100%)',
				}}
			/>
			
			{/* Partículas flotantes de corazones */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{Array.from({ length: 15 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute text-rose-300/20"
						style={{
							left: `${Math.random() * 100}%`,
							fontSize: `${Math.random() * 20 + 10}px`,
						}}
						animate={{
							y: [-20, -1000],
							x: [0, (Math.random() - 0.5) * 100],
							opacity: [0.3, 0],
							rotate: [0, 360],
						}}
						transition={{
							duration: 10 + Math.random() * 5,
							repeat: Infinity,
							delay: Math.random() * 5,
							ease: 'linear',
						}}
					>
						💕
					</motion.div>
				))}
			</div>

			{/* Contenido */}
			<div className="relative z-10 w-full max-w-2xl mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="space-y-8"
				>
					{/* Título */}
					<div>
						<p
							className="text-sm md:text-base uppercase tracking-[0.3em] mb-4"
							style={{ color: 'rgba(255, 192, 203, 0.8)' }}
						>
							14 de febrero
						</p>
						<h2
							className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
							style={{
								textShadow: '0 2px 24px rgba(0,0,0,0.4), 0 0 48px rgba(236, 72, 153, 0.3)',
							}}
						>
							San Valentín
						</h2>
						<p
							className="text-lg md:text-xl font-light max-w-md mx-auto"
							style={{ color: 'rgba(255, 255, 255, 0.85)' }}
						>
							Un día especial para celebrar nuestro amor
						</p>
					</div>

					{/* Carta interactiva */}
					<Link
						href="/san-valentin"
						className="block w-full max-w-md mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 rounded-2xl"
					>
						<motion.div
							className="relative backdrop-blur-xl rounded-2xl p-10 md:p-12 border border-rose-300/30 bg-gradient-to-br from-rose-500/20 to-pink-500/20 shadow-2xl"
							style={{
								boxShadow:
									'0 0 60px rgba(236, 72, 153, 0.2), 0 0 24px rgba(244, 114, 182, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
							}}
							whileHover={{ scale: 1.03, y: -5 }}
							whileTap={{ scale: 0.98 }}
						>
							{/* Sobre cerrado */}
							<div className="relative">
								<motion.div
									animate={{
										rotateX: [0, 5, 0],
									}}
									transition={{
										duration: 3,
										repeat: Infinity,
										ease: 'easeInOut',
									}}
									className="text-6xl mb-4"
								>
									💌
								</motion.div>
								
								<p
									className="font-display text-2xl md:text-3xl font-semibold text-white mb-3"
									style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
								>
									Una carta para ti
								</p>
								
								<p className="text-sm text-white/70">
									Toca para abrir
								</p>
							</div>

							{/* Efecto de brillo */}
							<motion.div
								className="absolute inset-0 rounded-2xl"
								style={{
									background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
									backgroundSize: '200% 200%',
								}}
								animate={{
									backgroundPosition: ['0% 0%', '100% 100%'],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: 'linear',
								}}
							/>
						</motion.div>
					</Link>
				</motion.div>
			</div>
		</section>
	)
}
