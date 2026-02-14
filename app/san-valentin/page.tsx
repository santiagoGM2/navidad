'use client'

import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'

import Flowers from '@/components/Flowers'

export default function SanValentinPage() {
	return (
		<div
			className="min-h-screen relative overflow-hidden flex items-center justify-center"
			style={{
				background: 'linear-gradient(180deg, #1a0f2e 0%, #2d1b3d 40%, #4a1942 100%)',
			}}
		>
			<BackButton label="Volver" />

			{/* Partículas de fondo */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-2 h-2 bg-rose-300/30 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							scale: [1, 1.5, 1],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							repeat: Infinity,
							delay: Math.random() * 2,
						}}
					/>
				))}
			</div>

			{/* Contenido principal */}
			<div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-10 flex flex-col items-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-0 relative z-20"
				>
					<h1
						className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
						style={{
							textShadow: '0 2px 24px rgba(0,0,0,0.4), 0 0 48px rgba(236, 72, 153, 0.3)',
						}}
					>
						Para ti, con todo mi amor
					</h1>

					<p
						className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto"
					>
						En este día especial, quiero que sepas que cada momento contigo es un regalo.
						Eres mi persona favorita, mi mejor amiga, mi amor eterno.
					</p>
				</motion.div>

				{/* Ramo de flores animado */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5, duration: 1 }}
					className="relative w-full h-[60vh] -mt-10"
				>
					<Flowers />
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5 }}
					className="relative z-20 text-white/70 text-sm md:text-base italic -mt-10 mb-10"
				>
					&ldquo;El amor no se mira, se siente en cada latido del corazón&rdquo;
				</motion.p>
			</div>
		</div>
	)
}
