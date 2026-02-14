'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'

const ANNIVERSARY_DATE = '2026-04-06'

interface SealedLetter {
	id: string
	type: 'date' | 'password'
	title: string
	description: string
	unlockDate?: string
	password?: string
	content: string
	hint?: string
	hints?: string[]
}

const SEALED_LETTERS: SealedLetter[] = [
	{
		id: 'anniversary',
		type: 'date',
		title: 'Aniversario',
		description: 'Para cuando cumplamos 1 año',
		unlockDate: ANNIVERSARY_DATE,
		content: `Mi amor,

Hoy cumplimos un año juntos. Un año de risas, de abrazos, de conversaciones hasta tarde, de crecer juntos.

Este año ha sido el más hermoso de mi vida porque has estado en él. Cada día a tu lado es un regalo.

Te amo más de lo que las palabras pueden expresar.

Para siempre,
Tu amor eterno.`
	},
	{
		id: 'discussion',
		type: 'password',
		title: 'Discusión',
		description: 'Leer solo cuando discutimos',
		password: 'perdon',
		content: `Mi cachetona hermosa,

Sé que a veces las cosas se complican. Sé que a veces nos lastimamos sin querer.

Pero quiero que sepas que, sin importar qué pase, siempre estaré aquí. Siempre elegiré arreglar las cosas contigo.

Porque tú vales más que cualquier orgullo. Porque nuestro amor es más fuerte que cualquier malentendido.

Perdón si te lastimé. Perdón si no supe expresarme bien.

Siempre te amaré,
Tu amor.`
	},
	{
		id: 'when-happy',
		type: 'password',
		title: 'Cuando esté feliz',
		description: 'Abre cuando estés feliz',
		password: 'estoyfeliz',
		content: `Qué bueno que estés feliz. Eso me hace feliz a mí también.

Quiero ser parte de esa felicidad siempre. Gracias por compartirla conmigo.

Te amo.`
	},
	{
		id: 'when-miss',
		type: 'password',
		title: 'Cuando me extrañe',
		description: 'Abre cuando me extrañes',
		password: 'codigo',
		content: `Cuando me extrañes, acuérdate de esto: yo también te extraño todo el tiempo.

No estás sola. Estoy contigo aunque no nos veamos. Te amo y te estaré esperando.

Pronto nos vemos, mi vida.`
	},
]

export default function SealedLetters() {
	const [unlockedLetters, setUnlockedLetters] = useState<Set<string>>(new Set())
	const [passwordInput, setPasswordInput] = useState<Record<string, string>>({})
	const [showPasswordInput, setShowPasswordInput] = useState<Record<string, boolean>>({})
	const [error, setError] = useState<Record<string, boolean>>({})
	const [hintLevel, setHintLevel] = useState<Record<string, number>>({})

	const countdownAnniversary = useCountdown(ANNIVERSARY_DATE)

	useEffect(() => {
		if (countdownAnniversary.isExpired && !unlockedLetters.has('anniversary')) {
			setUnlockedLetters((prev) => new Set([...prev, 'anniversary']))
		}
	}, [countdownAnniversary.isExpired, unlockedLetters])

	function getCountdown(letter: SealedLetter) {
		return countdownAnniversary
	}

	function isDateUnlocked(letter: SealedLetter) {
		return letter.unlockDate ? getCountdown(letter).isExpired : false
	}

	const handlePasswordSubmit = (letterId: string, correctPassword: string) => {
		const input = passwordInput[letterId]?.toLowerCase().trim() ?? ''
		const normalized = correctPassword.toLowerCase().trim()
		if (input === normalized) {
			setUnlockedLetters((prev) => new Set([...prev, letterId]))
			setShowPasswordInput((prev) => ({ ...prev, [letterId]: false }))
			setError((prev) => ({ ...prev, [letterId]: false }))
		} else {
			setError((prev) => ({ ...prev, [letterId]: true }))
			setHintLevel((prev) => ({ ...prev, [letterId]: (prev[letterId] ?? 0) + 1 }))
			setTimeout(() => setError((prev) => ({ ...prev, [letterId]: false })), 2000)
		}
	}

	const handleLetterClick = (letter: SealedLetter) => {
		if (letter.type === 'password' && !unlockedLetters.has(letter.id)) {
			setShowPasswordInput(prev => ({ ...prev, [letter.id]: true }))
		}
	}

	return (
		<section className="py-32 md:py-48 px-6 relative z-10">
			<div className="max-w-4xl mx-auto">
				{/* Título de sección */}
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
						Cartas cerradas en el tiempo
					</h2>
					<p 
						className="text-base md:text-lg font-light"
						style={{ 
							color: 'rgba(255, 255, 255, 0.85)',
							textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
						}}
					>
						Mensajes que esperan el momento perfecto para ser leídos
					</p>
				</motion.div>

				{/* Grid de cartas */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
					{SEALED_LETTERS.map((letter, index) => {
						const isUnlocked = unlockedLetters.has(letter.id)
						const isDateLocked = letter.type === 'date' && !isUnlocked
						const showInput = showPasswordInput[letter.id]
						const countdown = letter.type === 'date' ? getCountdown(letter) : null
						const level = hintLevel[letter.id] ?? 0
						const hintText = letter.hint
							? (level > 0 ? letter.hint : null)
							: (letter.hints && level > 0 ? letter.hints[Math.min(level - 1, letter.hints.length - 1)] : null)

						return (
							<motion.div
								key={letter.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.2, duration: 0.6 }}
								viewport={{ once: true }}
								className="relative"
							>
								{/* Carta sellada */}
								<motion.div
									className={`relative backdrop-blur-xl rounded-2xl p-8 border-2 transition-all duration-500 cursor-pointer ${
										isUnlocked
											? 'bg-white/15 border-white/40 shadow-2xl'
											: 'bg-white/5 border-white/20 hover:border-white/30'
									}`}
									whileHover={!isUnlocked ? { scale: 1.02 } : {}}
									whileTap={!isUnlocked ? { scale: 0.98 } : {}}
									onClick={() => !isUnlocked && handleLetterClick(letter)}
								>
									{/* Candado */}
									{!isUnlocked && (
										<motion.div
											className="absolute top-4 right-4"
											animate={{ 
												scale: [1, 1.1, 1],
												rotate: [0, -5, 5, 0]
											}}
											transition={{ 
												duration: 2,
												repeat: Infinity,
												repeatDelay: 3
											}}
										>
											<svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
												<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
											</svg>
										</motion.div>
									)}

									{/* Contenido bloqueado */}
									{!isUnlocked && (
										<div className="text-center">
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: 0.2 }}
												className="mb-4"
											>
												<svg className="w-16 h-16 mx-auto text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
													<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
												</svg>
											</motion.div>

											<h3 
												className="font-display text-xl md:text-2xl text-white font-semibold mb-2"
												style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
											>
												{letter.title}
											</h3>

											{isDateLocked && countdown && (
												<motion.div
													className="mb-4"
													key={`${letter.id}-${countdown.days}-${countdown.hours}-${countdown.minutes}-${countdown.seconds}`}
													initial={{ scale: 1.05 }}
													animate={{ scale: 1 }}
													transition={{ duration: 0.3 }}
												>
													<p 
														className="text-sm md:text-base mb-3"
														style={{ color: 'rgba(255, 255, 255, 0.7)' }}
													>
														Esta carta se abrirá el 6 de abril de 2026
													</p>
													<div className="flex flex-wrap justify-center gap-3 md:gap-4">
														<div className="text-center">
															<div 
																className="text-2xl md:text-3xl font-bold"
																style={{ color: 'rgba(251, 191, 36, 0.95)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
															>
																{countdown.days}
															</div>
															<div 
																className="text-xs md:text-sm uppercase tracking-wider mt-1"
																style={{ color: 'rgba(255, 255, 255, 0.6)' }}
															>
																{countdown.days === 1 ? 'Día' : 'Días'}
															</div>
														</div>
														
														{/* Horas */}
														<div className="text-center">
															<div 
																className="text-2xl md:text-3xl font-bold"
																style={{ color: 'rgba(251, 191, 36, 0.95)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
															>
																{countdown.hours}
															</div>
															<div 
																className="text-xs md:text-sm uppercase tracking-wider mt-1"
																style={{ color: 'rgba(255, 255, 255, 0.6)' }}
															>
																{countdown.hours === 1 ? 'Hora' : 'Horas'}
															</div>
														</div>
														
														{/* Minutos */}
														<div className="text-center">
															<div 
																className="text-2xl md:text-3xl font-bold"
																style={{ color: 'rgba(251, 191, 36, 0.95)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
															>
																{countdown.minutes}
															</div>
															<div 
																className="text-xs md:text-sm uppercase tracking-wider mt-1"
																style={{ color: 'rgba(255, 255, 255, 0.6)' }}
															>
																{countdown.minutes === 1 ? 'Min' : 'Min'}
															</div>
														</div>
														
														{/* Segundos */}
														<div className="text-center">
															<div 
																className="text-2xl md:text-3xl font-bold"
																style={{ color: 'rgba(251, 191, 36, 0.95)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
															>
																{countdown.seconds}
															</div>
															<div 
																className="text-xs md:text-sm uppercase tracking-wider mt-1"
																style={{ color: 'rgba(255, 255, 255, 0.6)' }}
															>
																Seg
															</div>
														</div>
													</div>
												</motion.div>
											)}

											{letter.type === 'password' && !showInput && (
												<p 
													className="text-sm md:text-base"
													style={{ color: 'rgba(255, 255, 255, 0.7)' }}
												>
													{letter.description}
												</p>
											)}

											{letter.type === 'password' && showInput && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													className="mt-4"
												>
													<input
														type="password"
														autoComplete="off"
														value={passwordInput[letter.id] ?? ''}
														onChange={(e) => setPasswordInput((prev) => ({ ...prev, [letter.id]: e.target.value }))}
														onKeyDown={(e) => e.key === 'Enter' && letter.password && handlePasswordSubmit(letter.id, letter.password)}
														placeholder="Contraseña"
														className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
														autoFocus
													/>
													<motion.button
														type="button"
														onClick={() => letter.password && handlePasswordSubmit(letter.id, letter.password)}
														className="mt-3 w-full px-4 py-3 rounded-xl font-medium text-white bg-cyan-500/30 border border-cyan-400/40 hover:bg-cyan-500/40 transition-colors"
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
													>
														Desbloquear
													</motion.button>
													{error[letter.id] && (
														<motion.p
															initial={{ opacity: 0, y: -10 }}
															animate={{ opacity: 1, y: 0 }}
															className="mt-2 text-sm text-rose-400 text-center"
														>
															Incorrecto.
														</motion.p>
													)}
													{hintText && (
														<motion.p
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															className="mt-2 text-sm text-amber-300/90 text-center"
														>
															Pista: {hintText}
														</motion.p>
													)}
												</motion.div>
											)}
										</div>
									)}

									{/* Contenido desbloqueado */}
									<AnimatePresence>
										{isUnlocked && (
											<motion.div
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.9 }}
												transition={{ duration: 0.5 }}
												className="text-center"
											>
												<motion.div
													initial={{ scale: 0, rotate: -180 }}
													animate={{ scale: 1, rotate: 0 }}
													transition={{ delay: 0.2, type: 'spring' }}
													className="mb-4"
												>
													<svg className="w-16 h-16 mx-auto text-amber-400" fill="currentColor" viewBox="0 0 24 24">
														<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
													</svg>
												</motion.div>

												<h3 
													className="font-display text-xl md:text-2xl text-white font-semibold mb-4"
													style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
												>
													{letter.title}
												</h3>

												<div 
													className="prose prose-invert max-w-none text-left"
													style={{ color: 'rgba(255, 255, 255, 0.9)' }}
												>
													<p className="whitespace-pre-line leading-relaxed font-serif text-base md:text-lg">
														{letter.content}
													</p>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

