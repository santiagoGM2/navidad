'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const UNLOCK_CODE = '060226'

// Placeholder for the emotional letter — replace with your message
const ANNIVERSARY_LETTER = {
	title: 'Para ti, en nuestros 10 meses',
	content: `— Aquí irá tu carta o mensaje emocional. Puedes editarlo en el archivo components/AnniversarySection.tsx, buscando ANNIVERSARY_LETTER. —`,
}

// Simple floating petal/particle for ambient effect (no window ref for SSR)
function FloatingParticles() {
	const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		delay: Math.random() * 5,
		duration: 10 + Math.random() * 6,
		size: 4 + Math.random() * 6,
		opacity: 0.12 + Math.random() * 0.18,
		drift: (Math.random() - 0.5) * 60,
	})), [])

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute rounded-full bg-rose-300/40"
					style={{
						left: `${p.x}%`,
						top: '100%',
						width: p.size,
						height: p.size,
						opacity: p.opacity,
					}}
					animate={{
						y: [-20, -1000],
						x: [0, p.drift],
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

// Tulip SVG - simple elegant shape
function Tulip({ color, delay, className = '' }: { color: string; delay: number; className?: string }) {
	return (
		<motion.svg
			viewBox="0 0 40 56"
			className={`w-10 h-14 md:w-12 md:h-16 ${className}`}
			initial={{ opacity: 0, scale: 0.6, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
			aria-hidden
		>
			{/* Petals */}
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(72 20 22)" />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(144 20 22)" />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(216 20 22)" />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(288 20 22)" />
			{/* Center */}
			<circle cx="20" cy="22" r="4" fill="rgba(255,255,255,0.4)" />
			{/* Stem */}
			<rect x="18" y="38" width="4" height="18" rx="2" fill="rgba(34, 197, 94, 0.9)" />
		</motion.svg>
	)
}

// Small flower (e.g. filler)
function SmallFlower({ color, delay, className = '' }: { color: string; delay: number; className?: string }) {
	return (
		<motion.svg
			viewBox="0 0 24 24"
			className={`w-6 h-6 md:w-7 md:h-7 ${className}`}
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8, delay, type: 'spring', stiffness: 120 }}
			aria-hidden
		>
			<circle cx="12" cy="12" r="3" fill="rgba(255,220,150,0.9)" />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<ellipse key={i} cx="12" cy="12" rx="2" ry="6" fill={color} transform={`rotate(${i * 60} 12 12)`} />
			))}
		</motion.svg>
	)
}

// Bouquet: group of flowers with float animation
function Bouquet() {
	const reduceMotion = useReducedMotion()
	const bouquetFloat = reduceMotion ? {} : { y: [0, -12, 0], rotate: [0, 2, -2, 0] }
	return (
		<motion.div
			className="relative flex items-end justify-center gap-0"
			animate={bouquetFloat}
			transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
			aria-hidden
		>
			{/* Back row */}
			<div className="flex items-end gap-1 md:gap-2 -mb-2">
				<Tulip color="#f472b6" delay={0.2} className="transform -rotate-12" />
				<Tulip color="#c084fc" delay={0.35} />
				<Tulip color="#fbbf24" delay={0.5} className="transform rotate-12" />
			</div>
			{/* Front row */}
			<div className="flex items-end justify-center gap-1 md:gap-2 absolute">
				<SmallFlower color="#a78bfa" delay={0.6} className="transform -translate-y-2 -translate-x-4" />
				<Tulip color="#ec4899" delay={0.1} className="transform -rotate-6" />
				<Tulip color="#f59e0b" delay={0.25} />
				<SmallFlower color="#f472b6" delay={0.65} className="transform -translate-y-2 translate-x-4" />
			</div>
		</motion.div>
	)
}

export default function AnniversarySection() {
	const [code, setCode] = useState('')
	const [isUnlocked, setIsUnlocked] = useState(false)
	const [error, setError] = useState(false)
	const [attempts, setAttempts] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)
	const reduceMotion = useReducedMotion()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const trimmed = code.replace(/\s/g, '')
		if (trimmed === UNLOCK_CODE) {
			setError(false)
			setIsUnlocked(true)
		} else {
			setError(true)
			setAttempts((a) => a + 1)
			setCode('')
			setTimeout(() => inputRef.current?.focus(), 100)
		}
	}

	const handleCodeChange = (value: string) => {
		if (/^\d*$/.test(value) && value.length <= 6) {
			setCode(value)
			setError(false)
		}
	}

	return (
		<section
			id="anniversary"
			className="relative py-24 md:py-32 px-4 md:px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden"
			aria-labelledby="anniversary-heading"
		>
			{/* Dark elegant background with subtle glow */}
			<div
				className="absolute inset-0 z-0"
				style={{
					background: 'linear-gradient(180deg, #0f0a15 0%, #1a0f2e 40%, #1e1b4b 100%)',
					boxShadow: 'inset 0 0 120px rgba(139, 92, 246, 0.08), inset 0 0 60px rgba(236, 72, 153, 0.05)',
				}}
			/>
			<div
				className="absolute inset-0 z-0 opacity-60"
				style={{
					background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)',
				}}
			/>

			{!reduceMotion && <FloatingParticles />}

			<div className="relative z-10 w-full max-w-2xl mx-auto text-center">
				{/* Section title */}
				<motion.div
					className="mb-10 md:mb-14"
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
				>
					<p
						className="text-sm md:text-base uppercase tracking-[0.3em] mb-3"
						style={{ color: 'rgba(255, 255, 255, 0.6)' }}
					>
						6 de febrero de 2026
					</p>
					<h2
						id="anniversary-heading"
						className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white"
						style={{
							textShadow: '0 2px 24px rgba(0,0,0,0.4), 0 0 48px rgba(139, 92, 246, 0.25)',
						}}
					>
						10 meses
					</h2>
					<p
						className="mt-3 text-base md:text-lg font-light max-w-md mx-auto"
						style={{ color: 'rgba(255, 255, 255, 0.85)' }}
					>
						Un capítulo más de nuestra historia
					</p>
				</motion.div>

				{/* Animated bouquet */}
				<motion.div
					className="flex justify-center mb-14 md:mb-16"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3, duration: 1 }}
				>
					<Bouquet />
				</motion.div>

				<AnimatePresence mode="wait">
					{!isUnlocked ? (
						<motion.div
							key="locked"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.98 }}
							transition={{ duration: 0.5 }}
							className="relative"
						>
							{/* Locked letter card */}
							<motion.div
								className="relative backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/20 bg-white/5 shadow-2xl"
								whileHover={{ borderColor: 'rgba(255,255,255,0.3)' }}
								style={{
									boxShadow: '0 0 40px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
								}}
							>
								{/* Lock icon */}
								<motion.div
									className="flex justify-center mb-6"
									animate={reduceMotion ? {} : { y: [0, -4, 0] }}
									transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
								>
									<svg className="w-14 h-14 text-amber-400/90" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
										<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
									</svg>
								</motion.div>

								<h3
									className="font-display text-xl md:text-2xl text-white font-semibold mb-2"
									style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
								>
									Carta especial
								</h3>
								<p
									className="text-sm md:text-base mb-6"
									style={{ color: 'rgba(255, 255, 255, 0.75)' }}
								>
									Ingresa la fecha de hoy (ddmmaa) para abrirla
								</p>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="flex justify-center">
										<input
											ref={inputRef}
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											autoComplete="one-time-code"
											maxLength={6}
											value={code}
											onChange={(e) => handleCodeChange(e.target.value)}
											placeholder="······"
											className="w-40 md:w-48 text-center text-2xl md:text-3xl tracking-[0.5em] px-4 py-3 rounded-xl bg-white/10 border-2 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-colors placeholder-white/30"
											style={{
												color: 'rgba(255, 255, 255, 0.95)',
												borderColor: error ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.25)',
											}}
											aria-label="Código de 6 dígitos"
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
												className="text-sm text-rose-300/90"
											>
												{attempts >= 3 ? 'Piénsalo bien… es una fecha especial.' : 'Código incorrecto. Intenta de nuevo.'}
											</motion.p>
										)}
									</AnimatePresence>

									<motion.button
										type="submit"
										disabled={code.length !== 6}
										className="w-full md:w-auto px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400/50"
										whileHover={code.length === 6 ? { scale: 1.02 } : {}}
										whileTap={code.length === 6 ? { scale: 0.98 } : {}}
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
							className="relative"
						>
							{/* Open letter */}
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
			</div>
		</section>
	)
}
