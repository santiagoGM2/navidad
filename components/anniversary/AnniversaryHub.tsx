'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ANNIVERSARY_UNLOCK_CODE, ANNIVERSARY_LETTER } from '@/constants/anniversary'
import QuienEsMasGame from './QuienEsMasGame'

/** Soft falling petals for the hub (respects reduced motion) */
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
	const [code, setCode] = useState('')
	const [letterUnlocked, setLetterUnlocked] = useState(false)
	const [error, setError] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const reduceMotion = useReducedMotion()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const trimmed = code.replace(/\s/g, '')
		if (trimmed === ANNIVERSARY_UNLOCK_CODE) {
			setError(false)
			setLetterUnlocked(true)
		} else {
			setError(true)
			setCode('')
			setTimeout(() => inputRef.current?.focus(), 100)
		}
	}

	const handleCodeChange = (value: string) => {
		if (/^\d*$/.test(value) && value.length <= 4) {
			setCode(value)
			setError(false)
		}
	}

	return (
		<div className="relative space-y-20 md:space-y-24">
			<HubPetals reduceMotion={reduceMotion ?? null} />

			{/* Optional sound toggle — wire to public/ambient.mp3 or similar if desired */}
			<div className="absolute top-0 right-0 flex items-center gap-2">
				<button
					type="button"
					onClick={() => {}}
					className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/30 text-sm"
					aria-label="Sonido ambiente (opcional)"
					title="Sonido ambiente (próximamente)"
				>
					🔇
				</button>
			</div>

			{/* A) Locked letter */}
			<section aria-labelledby="letter-heading">
				<AnimatePresence mode="wait">
					{!letterUnlocked ? (
						<motion.div
							key="locked"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.98 }}
							transition={{ duration: 0.5 }}
						>
							<motion.div
								className="relative backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/20 bg-white/5 shadow-2xl max-w-lg mx-auto"
								style={{
									boxShadow: '0 0 40px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
								}}
							>
								<motion.div
									className="flex justify-center mb-6"
									animate={reduceMotion ? {} : { y: [0, -4, 0] }}
									transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
								>
									<svg className="w-14 h-14 text-amber-400/90" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
										<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
									</svg>
								</motion.div>

								<h2
									id="letter-heading"
									className="font-display text-xl md:text-2xl text-white font-semibold mb-2 text-center"
									style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
								>
									Carta especial
								</h2>
								<p className="text-sm md:text-base mb-6 text-center" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
									Ingresa el código para abrirla
								</p>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="flex justify-center">
										<input
											ref={inputRef}
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											autoComplete="one-time-code"
											maxLength={4}
											value={code}
											onChange={(e) => handleCodeChange(e.target.value)}
											placeholder="····"
											className="w-32 md:w-36 text-center text-2xl tracking-[0.4em] px-4 py-3 rounded-xl bg-white/10 border-2 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-colors placeholder-white/30"
											style={{
												color: 'rgba(255, 255, 255, 0.95)',
												borderColor: error ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.25)',
											}}
											aria-label="Código de 4 dígitos"
											aria-invalid={error}
											aria-describedby={error ? 'code-error' : undefined}
										/>
									</div>

									<AnimatePresence>
										{error && (
											<motion.p
												id="code-error"
												role="alert"
												initial={{ opacity: 0, y: -8 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												className="text-sm text-rose-300/90 text-center"
											>
												Pista: una fecha muy especial 💭
											</motion.p>
										)}
									</AnimatePresence>

									<motion.button
										type="submit"
										disabled={code.length !== 4}
										className="w-full md:w-auto block mx-auto px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400/50"
										whileHover={code.length === 4 ? { scale: 1.02 } : {}}
										whileTap={code.length === 4 ? { scale: 0.98 } : {}}
									>
										Abrir carta
									</motion.button>
								</form>
							</motion.div>
						</motion.div>
					) : (
						<motion.div
							key="unlocked"
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
							className="max-w-lg mx-auto"
						>
							<motion.div
								className="relative backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 bg-gradient-to-br from-amber-50/95 to-white/95 shadow-2xl"
								style={{
									color: '#78350f',
									boxShadow: '0 0 60px rgba(251, 191, 36, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
								}}
							>
								<div className="absolute top-4 right-4 w-12 h-12 opacity-20">
									<svg viewBox="0 0 24 24" className="w-full h-full text-rose-400" fill="currentColor" aria-hidden>
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>
								</div>

								<motion.h2
									className="font-display text-2xl md:text-3xl font-semibold text-amber-900 mb-6 text-center"
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									{ANNIVERSARY_LETTER.title}
								</motion.h2>

								<motion.div
									className="prose prose-amber max-w-none text-left"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<p className="text-amber-900/90 leading-relaxed whitespace-pre-line text-base md:text-lg font-serif">
										{ANNIVERSARY_LETTER.content}
									</p>
								</motion.div>

								<motion.div
									className="mt-10 flex justify-center"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
								>
									<motion.div
										className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg"
										animate={reduceMotion ? {} : { scale: [1, 1.08, 1] }}
										transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
										aria-hidden
									>
										<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
										</svg>
									</motion.div>
								</motion.div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</section>

			{/* B) Game */}
			<section className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-8 md:p-10 max-w-2xl mx-auto" aria-labelledby="game-heading">
				<div id="game-heading" className="sr-only">
					Juego ¿Quién es más?
				</div>
				<QuienEsMasGame />
			</section>
		</div>
	)
}
