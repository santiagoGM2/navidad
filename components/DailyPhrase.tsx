'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Phrase {
	id: string
	text: string
	author?: string
}

export default function DailyPhrase() {
	const [phrase, setPhrase] = useState<Phrase | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchPhrase()
	}, [])

	const fetchPhrase = async () => {
		try {
			setIsLoading(true)
			const response = await fetch('/api/daily-phrase')
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Error al cargar la frase')
			}

			setPhrase(data.phrase)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error desconocido')
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<motion.div
					className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
				/>
			</div>
		)
	}

	if (error || !phrase) {
		return null
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative text-center"
		>
			{/* Ambient glow */}
			<div
				className="absolute -inset-8 rounded-3xl opacity-20 -z-10"
				style={{
					background: 'radial-gradient(ellipse at center, rgba(244, 199, 148, 0.3) 0%, transparent 60%)'
				}}
			/>

			<div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10">
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

				<p className="text-xs text-amber-200/50 uppercase tracking-widest mb-4">
					Frase del dia
				</p>

				<motion.p
					key={phrase.id}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="font-display text-xl md:text-2xl lg:text-3xl text-white/90 italic leading-relaxed mb-4"
				>
					&ldquo;{phrase.text}&rdquo;
				</motion.p>

				{phrase.author && (
					<p className="text-sm text-white/50">
						- {phrase.author}
					</p>
				)}
			</div>
		</motion.div>
	)
}
