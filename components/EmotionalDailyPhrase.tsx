'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Phrase {
	id: string
	text: string
	author?: string
}

interface EmotionalPhrases {
	happy: Phrase[]
	regular: Phrase[]
	sad: Phrase[]
}

// Frases según estado emocional
const EMOTIONAL_PHRASES: EmotionalPhrases = {
	happy: [
		{ id: 'h1', text: 'Tu sonrisa ilumina mi mundo más que todas las estrellas juntas.' },
		{ id: 'h2', text: 'Cada día contigo es una nueva aventura llena de felicidad.' },
		{ id: 'h3', text: 'Tu alegría es contagiosa y hace que todo sea mejor.' },
	],
	regular: [
		{ id: 'r1', text: 'Estoy aquí, siempre, sin importar cómo te sientas hoy.' },
		{ id: 'r2', text: 'Los días normales contigo son especiales para mí.' },
		{ id: 'r3', text: 'Tu presencia hace que cualquier día sea mejor.' },
	],
	sad: [
		{ id: 's1', text: 'Cuando estés triste, recuerda que tienes a alguien que te ama incondicionalmente.' },
		{ id: 's2', text: 'No estás sola. Estoy aquí para ti, siempre.' },
		{ id: 's3', text: 'Las nubes pasan, pero nuestro amor permanece. Te amo.' },
	]
}

type EmotionalState = 'happy' | 'regular' | 'sad' | null

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getTodayDateString(): string {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return today.toISOString().split('T')[0]
}

// Función determinística para seleccionar frase basada en fecha y estado
function getDailyPhrase(state: EmotionalState, dateString: string): Phrase | null {
	if (!state) return null
	
	const phrases = EMOTIONAL_PHRASES[state]
	if (phrases.length === 0) return null
	
	// Crear un hash simple y determinístico basado en la fecha
	// Convertir la fecha en un número y usar módulo para seleccionar la frase
	const dateHash = parseInt(dateString.replace(/-/g, ''), 10)
	const index = dateHash % phrases.length
	
	return phrases[index]
}

// Clave para localStorage
const STORAGE_KEY = 'emotional-daily-phrase'
const STORAGE_DATE_KEY = 'emotional-daily-phrase-date'

/**
 * Componente ampliado de frase del día con estado emocional
 * Personaliza la experiencia según cómo se siente el usuario
 * Frases determinísticas: una frase por día por estado emocional
 */
export default function EmotionalDailyPhrase() {
	const [emotionalState, setEmotionalState] = useState<EmotionalState>(null)
	const [phrase, setPhrase] = useState<Phrase | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// Cargar frase según estado emocional (determinística por día)
	useEffect(() => {
		if (!emotionalState) {
			setPhrase(null)
			return
		}

		setIsLoading(true)
		
		// Obtener fecha actual
		const todayString = getTodayDateString()
		
		// Verificar si tenemos una frase guardada para hoy y este estado
		if (typeof window !== 'undefined') {
			const savedDate = localStorage.getItem(STORAGE_DATE_KEY)
			const savedState = localStorage.getItem(STORAGE_KEY + '-state')
			const savedPhraseId = localStorage.getItem(STORAGE_KEY + '-phrase-id')
			
			// Si la fecha guardada es de hoy y el estado coincide, usar la frase guardada
			if (savedDate === todayString && savedState === emotionalState && savedPhraseId) {
				const phrases = EMOTIONAL_PHRASES[emotionalState]
				const savedPhrase = phrases.find(p => p.id === savedPhraseId)
				if (savedPhrase) {
					setPhrase(savedPhrase)
					setIsLoading(false)
					return
				}
			}
		}
		
		// Obtener frase determinística para hoy y este estado
		setTimeout(() => {
			const dailyPhrase = getDailyPhrase(emotionalState, todayString)
			
			if (dailyPhrase) {
				setPhrase(dailyPhrase)
				
				// Guardar en localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem(STORAGE_DATE_KEY, todayString)
					localStorage.setItem(STORAGE_KEY + '-state', emotionalState)
					localStorage.setItem(STORAGE_KEY + '-phrase-id', dailyPhrase.id)
				}
			}
			
			setIsLoading(false)
		}, 300)
	}, [emotionalState])
	
	// Verificar si cambió el día y limpiar estado si es necesario
	useEffect(() => {
		if (typeof window === 'undefined') return
		
		const checkDateChange = () => {
			const todayString = getTodayDateString()
			const savedDate = localStorage.getItem(STORAGE_DATE_KEY)
			
			// Si cambió el día, limpiar localStorage para que se recarguen las frases
			if (savedDate && savedDate !== todayString) {
				localStorage.removeItem(STORAGE_KEY + '-state')
				localStorage.removeItem(STORAGE_KEY + '-phrase-id')
				
				// Si hay un estado activo, recargar la frase
				if (emotionalState) {
					const dailyPhrase = getDailyPhrase(emotionalState, todayString)
					if (dailyPhrase) {
						setPhrase(dailyPhrase)
						localStorage.setItem(STORAGE_DATE_KEY, todayString)
						localStorage.setItem(STORAGE_KEY + '-state', emotionalState)
						localStorage.setItem(STORAGE_KEY + '-phrase-id', dailyPhrase.id)
					}
				}
			}
		}
		
		// Verificar cada minuto si cambió el día
		const interval = setInterval(checkDateChange, 60000)
		checkDateChange() // Verificar inmediatamente
		
		return () => clearInterval(interval)
	}, [emotionalState])

	// Ajustar fondo según estado emocional
	useEffect(() => {
		if (!emotionalState || typeof document === 'undefined') return

		const root = document.documentElement
		
		switch (emotionalState) {
			case 'happy':
				root.style.setProperty('--emotion-color', 'rgba(251, 191, 36, 0.2)')
				root.style.setProperty('--emotion-intensity', '1.2')
				break
			case 'regular':
				root.style.setProperty('--emotion-color', 'rgba(139, 92, 246, 0.15)')
				root.style.setProperty('--emotion-intensity', '1')
				break
			case 'sad':
				root.style.setProperty('--emotion-color', 'rgba(99, 102, 241, 0.25)')
				root.style.setProperty('--emotion-intensity', '0.8')
				break
		}

		return () => {
			root.style.removeProperty('--emotion-color')
			root.style.removeProperty('--emotion-intensity')
		}
	}, [emotionalState])

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative text-center"
		>
			{/* Pregunta inicial */}
			<AnimatePresence mode="wait">
				{!emotionalState ? (
					<motion.div
						key="question"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="backdrop-blur-md bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10"
					>
						<p 
							className="font-display text-xl md:text-2xl mb-8"
							style={{ 
								color: 'rgba(255, 255, 255, 0.95)',
								textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
							}}
						>
							¿Cómo te sientes hoy?
						</p>

						<div className="flex flex-wrap justify-center gap-4">
							{[
								{ emoji: '😊', state: 'happy' as EmotionalState, label: 'Feliz' },
								{ emoji: '😐', state: 'regular' as EmotionalState, label: 'Regular' },
								{ emoji: '😢', state: 'sad' as EmotionalState, label: 'Triste' }
							].map(({ emoji, state, label }) => (
								<motion.button
									key={state}
									onClick={() => setEmotionalState(state)}
									className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<span className="text-3xl block mb-2">{emoji}</span>
									<span 
										className="text-sm font-medium"
										style={{ color: 'rgba(255, 255, 255, 0.9)' }}
									>
										{label}
									</span>
								</motion.button>
							))}
						</div>
					</motion.div>
				) : (
					<motion.div
						key="phrase"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="relative"
					>
						{/* Ambient glow según estado */}
						<div
							className="absolute -inset-8 rounded-3xl opacity-20 -z-10"
							style={{
								background: `radial-gradient(ellipse at center, var(--emotion-color, rgba(244, 199, 148, 0.3)) 0%, transparent 60%)`,
								transform: `scale(var(--emotion-intensity, 1))`
							}}
						/>

						<div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10">
							{/* Botón para cambiar estado */}
							<motion.button
								onClick={() => {
									setEmotionalState(null)
									setPhrase(null)
								}}
								className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</motion.button>

							{/* Star decoration */}
							<div className="flex justify-center mb-6">
								<motion.div
									animate={{
										opacity: [0.5, 1, 0.5],
										scale: [1, 1.1, 1]
									}}
									transition={{
										duration: 3,
										repeat: Infinity,
										ease: 'easeInOut'
									}}
									className="w-8 h-8"
								>
									<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-amber-300/80">
										<path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
									</svg>
								</motion.div>
							</div>

							<p 
								className="text-xs uppercase tracking-widest mb-4"
								style={{ 
									color: 'rgba(251, 191, 36, 0.9)',
									textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
								}}
							>
								Frase del día
							</p>

							{isLoading ? (
								<motion.div
									className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full mx-auto"
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
								/>
							) : phrase ? (
								<motion.p
									key={phrase.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="font-display text-xl md:text-2xl lg:text-3xl italic leading-relaxed mb-4"
									style={{ 
										color: 'rgba(255, 255, 255, 0.95)',
										textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
									}}
								>
									&ldquo;{phrase.text}&rdquo;
								</motion.p>
							) : null}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

