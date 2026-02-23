'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TARGET_CLICKS = 100

type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTIES: Record<Difficulty, { label: string; time: number; color: string }> = {
	easy: { label: 'Fácil', time: 15000, color: 'text-emerald-400' },
	medium: { label: 'Medio', time: 12000, color: 'text-amber-400' },
	hard: { label: 'Difícil', time: 10000, color: 'text-rose-400' },
}

export default function UnlockableHeart() {
	const [difficulty, setDifficulty] = useState<Difficulty>('medium')
	const [showInvitation, setShowInvitation] = useState(true)
	const [clicks, setClicks] = useState(0)
	const [isUnlocked, setIsUnlocked] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [timeRemaining, setTimeRemaining] = useState(DIFFICULTIES.medium.time)
	const [showMessage, setShowMessage] = useState(false)
	const [failed, setFailed] = useState(false)

	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const startTimeRef = useRef<number | null>(null)
	const timeLimit = DIFFICULTIES[difficulty].time

	const startGame = () => {
		setClicks(0)
		setIsActive(true)
		setFailed(false)
		setTimeRemaining(timeLimit)
		startTimeRef.current = Date.now()

		if (timerRef.current) clearInterval(timerRef.current)

		timerRef.current = setInterval(() => {
			const elapsed = Date.now() - (startTimeRef.current || 0)
			const remaining = timeLimit - elapsed

			if (remaining <= 0) {
				setIsActive(false)
				if (clicks < TARGET_CLICKS) setFailed(true)
				setTimeRemaining(0)
				if (timerRef.current) {
					clearInterval(timerRef.current)
					timerRef.current = null
				}
			} else {
				setTimeRemaining(remaining)
			}
		}, 10)
	}

	const handleClick = () => {
		if (isUnlocked || failed) return
		if (!isActive) {
			startGame()
			return
		}

		setClicks(prev => {
			const newClicks = prev + 1
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
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [])

	const progress = Math.min((clicks / TARGET_CLICKS) * 100, 100)
	const timeProgress = Math.min(((timeLimit - timeRemaining) / timeLimit) * 100, 100)

	return (
		<div className="max-w-2xl mx-auto text-center px-4">
			<AnimatePresence mode="wait">
				{showInvitation ? (
					<motion.div
						key="invitation"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="backdrop-blur-xl bg-white/5 rounded-3xl p-10 md:p-14 border border-white/10 shadow-2xl"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="space-y-6"
						>
							<h2 className="font-display text-3xl md:text-5xl text-white font-bold leading-tight">
								Desafío de <span className="text-rose-400">Velocidad</span>
							</h2>
							<p className="text-white/70 text-lg font-light max-w-sm mx-auto">
								Demuestra qué tan rápido puedes pulsar el corazón para desbloquear un mensaje especial.
							</p>

							<div className="py-8">
								<p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Selecciona dificultad</p>
								<div className="flex flex-wrap justify-center gap-3">
									{(Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES['easy']][]).map(([key, def]) => (
										<button
											key={key}
											onClick={() => {
												setDifficulty(key)
												setTimeRemaining(def.time)
											}}
											className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${difficulty === key
												? `bg-white/20 border-white/40 text-white shadow-lg`
												: 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
												}`}
										>
											{def.label} ({def.time / 1000}s)
										</button>
									))}
								</div>
							</div>

							<motion.button
								onClick={() => setShowInvitation(false)}
								className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_44px_rgba(244,63,94,0.4)]"
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.98 }}
							>
								¡Estoy list{difficulty === 'hard' ? 'o/a' : 'a'}!
							</motion.button>
						</motion.div>
					</motion.div>
				) : (
					<motion.div
						key="game"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="space-y-12"
					>
						<div className="space-y-2">
							<h3 className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
								{isUnlocked ? 'Reto Completado' : failed ? 'Reto Fallido' : `Nivel ${DIFFICULTIES[difficulty].label}`}
							</h3>
							<h2 className="font-display text-3xl md:text-4xl text-white font-bold leading-tight">
								{isUnlocked ? '¡Lo lograste!' : failed ? 'Casi lo tienes...' : 'Pulsa sin parar'}
							</h2>
						</div>

						<div className="relative inline-block mt-4">
							<motion.button
								onClick={handleClick}
								disabled={isUnlocked}
								className="relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center cursor-pointer disabled:cursor-default outline-none"
								whileTap={!isUnlocked ? { scale: 0.9 } : {}}
							>
								<motion.svg
									className="w-full h-full drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]"
									fill={isUnlocked ? '#f43f5e' : failed ? '#4a5568' : '#fb7185'}
									viewBox="0 0 24 24"
									animate={isActive ? {
										scale: [1, 1.1, 1],
									} : isUnlocked ? {
										scale: [1, 1.15, 1],
										filter: ['drop-shadow(0 0 10px #f43f5e)', 'drop-shadow(0 0 30px #f43f5e)', 'drop-shadow(0 0 10px #f43f5e)']
									} : {}}
									transition={{ duration: 0.6, repeat: Infinity }}
								>
									<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
								</motion.svg>

								<AnimatePresence>
									{!isUnlocked && !failed && (
										<motion.div
											className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl md:text-4xl pointer-events-none"
											key={clicks}
											initial={{ scale: 1.5, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											exit={{ scale: 0.8, opacity: 0 }}
										>
											{clicks}
										</motion.div>
									)}
								</AnimatePresence>
							</motion.button>

							{/* Rings of pulses */}
							{isActive && (
								<div className="absolute inset-0 pointer-events-none">
									{[1, 2, 3].map((i) => (
										<motion.div
											key={i}
											className="absolute inset-0 border border-rose-500/30 rounded-full"
											initial={{ scale: 1, opacity: 0.5 }}
											animate={{ scale: 2, opacity: 0 }}
											transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
										/>
									))}
								</div>
							)}
						</div>

						{/* Progress Bars */}
						{!isUnlocked && (
							<div className="max-w-xs mx-auto space-y-8 pt-6">
								<div className="space-y-2">
									<div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
										<span>Pulsaciones</span>
										<span>{clicks} / {TARGET_CLICKS}</span>
									</div>
									<div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
										<motion.div
											className="h-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
											initial={{ width: 0 }}
											animate={{ width: `${progress}%` }}
											transition={{ duration: 0.2 }}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
										<span>Tiempo</span>
										<span className={timeRemaining < 3000 ? 'text-rose-400 animate-pulse' : ''}>
											{(timeRemaining / 1000).toFixed(1)}s
										</span>
									</div>
									<div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
										<motion.div
											className={`h-full bg-gradient-to-r ${timeRemaining < 3000 ? 'from-rose-600 to-rose-400' : 'from-indigo-600 to-violet-400'}`}
											initial={{ width: '100%' }}
											animate={{ width: `${100 - timeProgress}%` }}
											transition={{ duration: 0.1 }}
										/>
									</div>
								</div>

								{failed && (
									<motion.button
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										onClick={startGame}
										className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all"
									>
										Intentar de nuevo
									</motion.button>
								)}
							</div>
						)}

						{/* Success Message */}
						<AnimatePresence>
							{isUnlocked && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9, y: 30 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl space-y-4 max-w-sm mx-auto"
								>
									<p className="text-white/60 text-xs font-bold uppercase tracking-widest">Mensaje Desbloqueado</p>
									<p className="text-xl md:text-2xl text-white font-light leading-relaxed">
										&ldquo;Amor, eres de verdad, de verdad muy cachetona&rdquo;
									</p>
									<button
										onClick={() => window.location.reload()}
										className="text-white/30 hover:text-white transition-colors text-xs pt-4"
									>
										Reiniciar juego
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
