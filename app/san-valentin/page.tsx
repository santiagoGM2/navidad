'use client'

import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'

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
			<div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
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
						className="text-lg md:text-xl text-white/85 mb-12 max-w-2xl mx-auto"
					>
						En este día especial, quiero que sepas que cada momento contigo es un regalo.
						Eres mi persona favorita, mi mejor amiga, mi amor eterno.
					</p>
				</motion.div>

				{/* Ramo de flores animado */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5, duration: 1, type: 'spring' }}
					className="relative w-full max-w-md mx-auto"
				>
					<AnimatedBouquet />
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5 }}
					className="mt-12 text-white/70 text-sm md:text-base italic"
				>
					&ldquo;El amor no se mira, se siente en cada latido del corazón&rdquo;
				</motion.p>
			</div>
		</div>
	)
}

// Componente del ramo animado
function AnimatedBouquet() {
	const flowers = [
		{ color: '#ff6b9d', delay: 0, x: 0, y: 0, rotate: 0 },
		{ color: '#ff8fab', delay: 0.1, x: -40, y: 20, rotate: -15 },
		{ color: '#ffa3ba', delay: 0.2, x: 40, y: 20, rotate: 15 },
		{ color: '#ff5e8a', delay: 0.3, x: -60, y: 50, rotate: -25 },
		{ color: '#ff9db8', delay: 0.4, x: 60, y: 50, rotate: 25 },
	]

	return (
		<div className="relative w-full h-96">
			{/* Tallo principal */}
			<motion.div
				initial={{ scaleY: 0 }}
				animate={{ scaleY: 1 }}
				transition={{ duration: 0.8, ease: 'easeOut' }}
				className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-48 bg-gradient-to-b from-green-600 to-green-800 rounded-full origin-bottom"
			/>

			{/* Hojas */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="absolute bottom-32 left-1/2 -translate-x-12 w-12 h-6 bg-green-500 rounded-full"
				style={{ transform: 'rotate(-30deg)' }}
			/>
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="absolute bottom-24 left-1/2 translate-x-4 w-12 h-6 bg-green-500 rounded-full"
				style={{ transform: 'rotate(30deg)' }}
			/>

			{/* Flores */}
			{flowers.map((flower, i) => (
				<motion.div
					key={i}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						delay: 0.8 + flower.delay,
						duration: 0.6,
						type: 'spring',
						stiffness: 200,
					}}
					className="absolute"
					style={{
						top: '20%',
						left: '50%',
						transform: `translate(${flower.x}px, ${flower.y}px) rotate(${flower.rotate}deg)`,
					}}
				>
					<Flower color={flower.color} />
				</motion.div>
			))}

			{/* Corazones flotantes */}
			{Array.from({ length: 8 }).map((_, i) => (
				<motion.div
					key={`heart-${i}`}
					className="absolute text-2xl"
					style={{
						left: `${30 + Math.random() * 40}%`,
						top: `${20 + Math.random() * 30}%`,
					}}
					animate={{
						y: [-10, -50],
						opacity: [0, 1, 0],
						scale: [0.5, 1, 0.5],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						delay: i * 0.4,
						ease: 'easeOut',
					}}
				>
					💕
				</motion.div>
			))}
		</div>
	)
}

// Componente de flor individual
function Flower({ color }: { color: string }) {
	return (
		<div className="relative w-20 h-20">
			{/* Pétalos */}
			{Array.from({ length: 6 }).map((_, i) => (
				<motion.div
					key={i}
					className="absolute top-1/2 left-1/2 w-8 h-12 rounded-full origin-bottom"
					style={{
						background: `linear-gradient(to bottom, ${color}, ${color}dd)`,
						transform: `translate(-50%, -100%) rotate(${i * 60}deg)`,
						boxShadow: `0 2px 8px ${color}66`,
					}}
					animate={{
						scale: [1, 1.05, 1],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						delay: i * 0.1,
						ease: 'easeInOut',
					}}
				/>
			))}
			
			{/* Centro de la flor */}
			<motion.div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-300"
				animate={{
					scale: [1, 1.1, 1],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
		</div>
	)
}
