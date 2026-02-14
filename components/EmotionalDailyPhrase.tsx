'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Phrase {
	id: string
	text: string
	author?: string | null
}

const STORAGE_KEY = 'daily-phrases-view'
const LOCK_MESSAGE =
	'Listo, ya solo puedes ver dos frases por hoy. Mañana vuelve y te dejo ver otras dos, mi vida.'

function getTodayDateString(): string {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return today.toISOString().split('T')[0]
}

interface StoredState {
	date: string
	phraseIds: [string, string]
	viewedCount: 1 | 2
	currentIndex: 0 | 1
}

function loadStoredState(): StoredState | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as StoredState
		return parsed.date && parsed.phraseIds ? parsed : null
	} catch {
		return null
	}
}

function saveStoredState(state: StoredState) {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	} catch {
		// ignore
	}
}

export default function EmotionalDailyPhrase() {
	const [phrases, setPhrases] = useState<Phrase[]>([])
	const [loading, setLoading] = useState(true)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [viewedCount, setViewedCount] = useState<1 | 2>(1)
	const [locked, setLocked] = useState(false)
	const [error, setError] = useState(false)

	const today = getTodayDateString()

	const fetchPhrases = useCallback(async () => {
		setLoading(true)
		setError(false)
		try {
			const res = await fetch(`/api/phrases/daily?date=${today}`)
			const data = await res.json()
			if (data.phrases && Array.isArray(data.phrases) && data.phrases.length >= 1) {
				const pair = data.phrases.slice(0, 2) as Phrase[]
				setPhrases(pair)
				const stored = loadStoredState()
				if (stored && stored.date === today && stored.phraseIds[0] === pair[0]?.id) {
					setViewedCount(stored.viewedCount)
					setCurrentIndex(stored.currentIndex)
					setLocked(stored.viewedCount >= 2)
				} else {
					setViewedCount(1)
					setCurrentIndex(0)
					setLocked(false)
					saveStoredState({
						date: today,
						phraseIds: [pair[0].id, (pair[1] || pair[0]).id],
						viewedCount: 1,
						currentIndex: 0,
					})
				}
			} else {
				setPhrases([])
				setViewedCount(1)
				setCurrentIndex(0)
				setLocked(false)
			}
		} catch {
			setError(true)
			setPhrases([])
		} finally {
			setLoading(false)
		}
	}, [today])

	useEffect(() => {
		fetchPhrases()
	}, [fetchPhrases])

	// Reset al cambiar de día
	useEffect(() => {
		const stored = loadStoredState()
		if (stored && stored.date !== today) {
			setViewedCount(1)
			setCurrentIndex(0)
			setLocked(false)
			fetchPhrases()
		}
	}, [today, fetchPhrases])

	const handleVerOtra = useCallback(() => {
		if (phrases.length < 2 || locked) return
		setViewedCount(2)
		setCurrentIndex(1)
		setLocked(true)
		const ids: [string, string] = [phrases[0].id, phrases[1].id]
		saveStoredState({
			date: today,
			phraseIds: ids,
			viewedCount: 2,
			currentIndex: 1,
		})
	}, [phrases, locked, today])

	const handleToggle = useCallback(() => {
		if (phrases.length < 2 || viewedCount < 2) return
		const next = currentIndex === 0 ? 1 : 0
		setCurrentIndex(next)
		saveStoredState({
			date: today,
			phraseIds: [phrases[0].id, phrases[1].id],
			viewedCount: 2,
			currentIndex: next,
		})
	}, [phrases, viewedCount, currentIndex, today])

	const currentPhrase = phrases[currentIndex]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative text-center"
		>
			<div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10">
				{loading ? (
					<div className="flex justify-center py-8">
						<motion.div
							className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full"
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						/>
					</div>
				) : error || phrases.length === 0 ? (
					<p
						className="font-display text-lg text-white/80"
						style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
					>
						Hoy no hay frases cargadas. Vuelve en un rato, mi vida.
					</p>
				) : (
					<>
						<div className="flex justify-center mb-6">
							<motion.div
								animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
								transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
								className="w-8 h-8"
							>
								<svg
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-full h-full text-amber-300/80"
								>
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
							{currentPhrase && (
								<motion.p
									key={currentPhrase.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
									className="font-display text-xl md:text-2xl lg:text-3xl italic leading-relaxed mb-6"
									style={{
										color: 'rgba(255, 255, 255, 0.95)',
										textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
									}}
								>
									&ldquo;{currentPhrase.text}&rdquo;
								</motion.p>
							)}
						</AnimatePresence>

						{locked ? (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-base md:text-lg text-white/90 font-medium mb-4"
								style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
							>
								{LOCK_MESSAGE}
							</motion.p>
						) : (
							phrases.length >= 2 && (
								<motion.button
									type="button"
									onClick={handleVerOtra}
									className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm font-medium"
									style={{
										color: 'rgba(255, 255, 255, 0.95)',
										textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
									}}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.98 }}
								>
									Ver otra
								</motion.button>
							)
						)}

						{viewedCount >= 2 && phrases.length >= 2 && (
							<motion.button
								type="button"
								onClick={handleToggle}
								className="mt-3 text-sm text-white/70 hover:text-white/90 transition-colors"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								{currentIndex === 0 ? 'Ver la otra frase' : 'Ver la primera frase'}
							</motion.button>
						)}
					</>
				)}
			</div>
		</motion.div>
	)
}
