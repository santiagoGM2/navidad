'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Phrase {
	id: string
	text: string
	author?: string | null
}

function getTodayDateString(): string {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return today.toISOString().split('T')[0]
}

export default function EmotionalDailyPhrase() {
	const [phrase, setPhrase] = useState<Phrase | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [hasMounted, setHasMounted] = useState(false)

	const today = getTodayDateString()

	useEffect(() => {
		setHasMounted(true)
	}, [])

	const fetchDailyPhrase = useCallback(async () => {
		setLoading(true)
		setError(false)
		try {
			// Usamos la API existente pero solo tomamos la primera
			const res = await fetch(`/api/phrases/daily?date=${today}`)
			const data = await res.json()
			if (data.phrases && Array.isArray(data.phrases) && data.phrases.length >= 1) {
				setPhrase(data.phrases[0])
			} else {
				setPhrase(null)
			}
		} catch {
			setError(true)
			setPhrase(null)
		} finally {
			setLoading(false)
		}
	}, [today])

	useEffect(() => {
		fetchDailyPhrase()
	}, [fetchDailyPhrase])

	if (!hasMounted) return <div className="min-h-[160px]" />

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="relative text-center w-full"
		>
			<div className="backdrop-blur-md bg-white/5 rounded-3xl p-10 md:p-16 border border-white/10 shadow-2xl">
				{loading ? (
					<div className="flex justify-center py-8">
						<motion.div
							className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full"
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						/>
					</div>
				) : error || !phrase ? (
					<p className="font-display text-lg text-white/60">
						Vuelve mañana para una nueva frase, mi vida.
					</p>
				) : (
					<div className="max-w-2xl mx-auto">
						<div className="flex justify-center mb-6">
							<motion.div
								animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
								transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
								className="w-10 h-10 text-amber-300/60"
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
								</svg>
							</motion.div>
						</div>

						<p
							className="text-xs uppercase tracking-widest mb-4"
							style={{
								color: 'rgba(251, 191, 36, 0.9)',
								textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
							}}
						>
							Frase del día
						</p>

						<AnimatePresence mode="wait">
							<motion.p
								key={phrase.id}
								initial={{ opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 1 }}
								className="font-display text-2xl md:text-3xl lg:text-4xl italic leading-tight text-white font-medium mb-2"
								style={{
									textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
									letterSpacing: '-0.01em'
								}}
							>
								&ldquo;{phrase.text}&rdquo;
							</motion.p>
						</AnimatePresence>
					</div>
				)}
			</div>
		</motion.div>
	)
}
