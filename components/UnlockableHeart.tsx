'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TARGET_CLICKS = 100
const TIME_LIMIT = 10000 // 10 segundos en milisegundos

/**
 * Componente de corazón desbloqueable
 * Reto: 100 clicks en menos de 10 segundos
 * Primero muestra una invitación, luego el juego
 */
export default function UnlockableHeart() {
	const [showInvitation, setShowInvitation] = useState(true)
	const [clicks, setClicks] = useState(0)
	const [isUnlocked, setIsUnlocked] = useState(false)
	const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT)
	const [isActive, setIsActive] = useState(false)
	const [showMessage, setShowMessage] = useState(false)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const startTimeRef = useRef<number | null>(null)

	const handleClick = () => {
		if (isUnlocked) return

		if (!isActive) {
			// Iniciar el reto
			setIsActive(true)
			startTimeRef.current = Date.now()
			setTimeRemaining(TIME_LIMIT)

			timerRef.current = setInterval(() => {
				const elapsed = Date.now() - (startTimeRef.current || 0)
				const remaining = TIME_LIMIT - elapsed

				if (remaining <= 0) {
					// Tiempo agotado
					setIsActive(false)
					setClicks(0)
					setTimeRemaining(0)
					if (timerRef.current) {
						clearInterval(timerRef.current)
						timerRef.current = null
					}
				} else {
					setTimeRemaining(remaining)
				}
			}, 10) // Actualizar cada 10ms para suavidad
		}

		setClicks(prev => {
			const newClicks = prev + 1
			
			// Verificar si se completó el reto
			if (newClicks >= TARGET_CLICKS && timeRemaining > 0) {
				setIsUnlocked(true)
				setShowMessage(true)
				setIsActive(false)
				if (timerRef.current) {
					clearInterval(timerRef.current)
					timerRef.current = null
				}
			}
			
			return newClicks
		})
	}

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current)
			}
		}
	}, [])

	const progress = Math.min((clicks / TARGET_CLICKS) * 100, 100)
	const timeProgress = Math.min(((TIME_LIMIT - timeRemaining) / TIME_LIMIT) * 100, 100)

	return (
		<section className="py-32 md:py-48 px-6 relative z-10">
			<div className="max-w-2xl mx-auto text-center">
				<AnimatePresence mode="wait">
					{showInvitation ? (
						// Pantalla de invitación
						<motion.div
							key="invitation"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.5 }}
							className="backdrop-blur-md bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10"
						>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="mb-8"
							>
								<h2 
									className="font-display text-2xl md:text-4xl text-white font-bold mb-6"
									style={{ 
										textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
									}}
								>
									Te propongo un juego...
								</h2>
								<p 
									className="text-lg md:text-xl font-light mb-4 leading-relaxed"
									style={{ 
										color: 'rgba(255, 255, 255, 0.9)',
										textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
									}}
								>
									Si lo cumples, tendrás una recompensa.
								</p>
								<p 
									className="text-base md:text-lg font-light mb-8"
									style={{ 
										color: 'rgba(255, 255, 255, 0.85)',
										textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
									}}
								>
									¿Te animas?
								</p>
							</motion.div>
							
							<motion.button
								onClick={() => setShowInvitation(false)}
								className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								Entrar al reto
							</motion.button>
						</motion.div>
					) : (
						// Pantalla del juego
						<motion.div
							key="game"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.5 }}
						>
							{/* Título */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
								className="mb-12"
							>
								<h2 
									className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
									style={{ 
										textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
									}}
								>
									Reto del Corazón
								</h2>
								<p 
									className="text-base md:text-lg font-light"
									style={{ 
										color: 'rgba(255, 255, 255, 0.85)',
										textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
									}}
								>
									{!isUnlocked 
										? '100 clicks en menos de 10 segundos'
										: '¡Lo lograste! ❤️'
									}
								</p>
							</motion.div>

							{/* Contenedor del corazón */}
							<motion.div
								className="relative inline-block"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.8, type: 'spring' }}
							>
								{/* Corazón */}
								<motion.button
									onClick={handleClick}
									disabled={isUnlocked}
									className="relative w-32 h-32 md:w-40 md:h-40 focus:outline-none disabled:cursor-default"
									whileHover={!isUnlocked ? { scale: 1.1 } : {}}
									whileTap={!isUnlocked ? { scale: 0.9 } : {}}
									animate={isUnlocked ? {
										scale: [1, 1.5, 1.3],
										rotate: [0, 5, -5, 0]
									} : {}}
									transition={{ duration: 0.8, repeat: isUnlocked ? Infinity : 0, repeatType: 'reverse' }}
								>
									<svg
										className="w-full h-full"
										fill={isUnlocked ? '#ef4444' : '#f87171'}
										viewBox="0 0 24 24"
									>
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>

									{/* Efecto de pulso al hacer click */}
									{!isUnlocked && isActive && (
										<motion.div
											className="absolute inset-0 rounded-full"
											style={{
												background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)'
											}}
											animate={{
												scale: [1, 1.5, 1],
												opacity: [0.5, 0, 0.5]
											}}
											transition={{
												duration: 0.3,
												repeat: Infinity
											}}
										/>
									)}
								</motion.button>

								{/* Contador de clicks */}
								{!isUnlocked && (
									<motion.div
										className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-bold"
										key={clicks}
										initial={{ scale: 1.3 }}
										animate={{ scale: 1 }}
										style={{ 
											color: clicks >= TARGET_CLICKS ? '#10b981' : '#fbbf24',
											textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
										}}
									>
										{clicks} / {TARGET_CLICKS}
									</motion.div>
								)}
							</motion.div>

							{/* Barra de progreso */}
							{!isUnlocked && isActive && (
								<motion.div
									className="mt-16 max-w-md mx-auto"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<div className="mb-2 flex justify-between text-sm">
										<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Progreso</span>
										<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
											{Math.round(progress)}%
										</span>
									</div>
									<div className="h-2 bg-white/10 rounded-full overflow-hidden">
										<motion.div
											className="h-full bg-gradient-to-r from-rose-400 to-pink-500"
											initial={{ width: 0 }}
											animate={{ width: `${progress}%` }}
											transition={{ duration: 0.1 }}
										/>
									</div>

									{/* Tiempo restante */}
									<div className="mt-4">
										<div className="mb-2 flex justify-between text-sm">
											<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Tiempo</span>
											<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
												{(timeRemaining / 1000).toFixed(1)}s
											</span>
										</div>
										<div className="h-1 bg-white/10 rounded-full overflow-hidden">
											<motion.div
												className="h-full bg-gradient-to-r from-violet-400 to-purple-500"
												initial={{ width: 0 }}
												animate={{ width: `${timeProgress}%` }}
												transition={{ duration: 0.1 }}
											/>
										</div>
									</div>
								</motion.div>
							)}

							{/* Mensaje desbloqueado */}
							<AnimatePresence>
								{showMessage && isUnlocked && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8, y: 20 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className="mt-12 backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20"
									>
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.2, type: 'spring' }}
											className="text-6xl mb-4"
										>
											❤️
										</motion.div>
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.4 }}
											className="font-display text-2xl md:text-3xl text-white"
											style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
										>
											Amor, eres de verdad, de verdad muy cachetona
										</motion.p>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	)
}
