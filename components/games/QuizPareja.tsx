'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

const QUESTIONS = [
	{ id: 1, text: '¿Dónde nos conocimos?', options: ['Trabajo', 'Amigos en común', 'Universidad', 'Otro lugar'] },
	{ id: 2, text: '¿Quién dijo "te amo" primero?', options: ['Santi', 'Tefa', 'Los dos a la vez', 'Aún no lo hemos dicho'] },
	{ id: 3, text: '¿Cuál fue nuestra primera cita?', options: ['Café', 'Cine', 'Comida', 'Un paseo'] },
]

const FINAL_MESSAGE = 'Gracias por jugar. Cada respuesta es parte de nuestra historia.'

export default function QuizPareja() {
	const [step, setStep] = useState(0)
	const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null))
	const [done, setDone] = useState(false)

	const current = QUESTIONS[step]
	const selected = answers[step]

	const handleSelect = (optionIndex: number) => {
		const next = [...answers]
		next[step] = optionIndex
		setAnswers(next)
		if (step === QUESTIONS.length - 1) {
			setDone(true)
			triggerVibration([80, 40, 80])
		} else {
			setStep((s) => s + 1)
		}
	}

	return (
		<div className="space-y-8">
			<h2 className="font-display text-2xl text-white text-center" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
				Quiz de pareja
			</h2>
			<p className="text-white/70 text-center text-sm">
				Respondan juntos. Sin prisa.
			</p>

			<AnimatePresence mode="wait">
				{done ? (
					<motion.div
						key="result"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center p-8 rounded-2xl bg-white/10 border border-white/20"
					>
						<p className="text-white font-display text-lg leading-relaxed max-w-md mx-auto mb-4">
							{FINAL_MESSAGE}
						</p>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', delay: 0.2 }}
							className="inline-block w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/40 border border-white/30"
						/>
					</motion.div>
				) : (
					<motion.div
						key={step}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<p className="text-white font-medium text-center">
							{step + 1} de {QUESTIONS.length}
						</p>
						<p className="text-white text-xl text-center font-display">
							{current.text}
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{current.options.map((opt, i) => (
								<motion.button
									key={i}
									type="button"
									onClick={() => handleSelect(i)}
									className={`py-4 px-4 rounded-xl text-left font-medium transition-all border ${
										selected === i
											? 'bg-white/20 border-white/40 text-white'
											: 'bg-white/5 border-white/20 text-white/90 hover:bg-white/10'
									}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									{opt}
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
