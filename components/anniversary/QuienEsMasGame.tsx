'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIEN_ES_MAS_QUESTIONS, RELATIONSHIP_ANALYSIS } from '@/constants/anniversary'

type Vote = 'santi' | 'tefa'

export default function QuienEsMasGame() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [votes, setVotes] = useState<(Vote | null)[]>(Array(QUIEN_ES_MAS_QUESTIONS.length).fill(null))
	const [showResults, setShowResults] = useState(false)

	const question = QUIEN_ES_MAS_QUESTIONS[currentIndex]
	const total = QUIEN_ES_MAS_QUESTIONS.length
	const answered = votes.filter(Boolean).length
	const isLast = currentIndex === total - 1
	const allDone = answered === total

	const handleVote = (v: Vote) => {
		const next = [...votes]
		next[currentIndex] = v
		setVotes(next)
		if (isLast) {
			setShowResults(true)
		} else {
			setCurrentIndex((i) => i + 1)
		}
	}

	const santiWins = votes
		.map((v, i) => (v === 'santi' ? QUIEN_ES_MAS_QUESTIONS[i].traitSanti : null))
		.filter(Boolean) as string[]
	const tefaWins = votes
		.map((v, i) => (v === 'tefa' ? QUIEN_ES_MAS_QUESTIONS[i].traitTefa : null))
		.filter(Boolean) as string[]

	const santiCount = votes.filter((v) => v === 'santi').length
	const tefaCount = votes.filter((v) => v === 'tefa').length
	const [analysis, setAnalysis] = useState('')
	useEffect(() => {
		if (showResults && !analysis) {
			setAnalysis(RELATIONSHIP_ANALYSIS[Math.floor(Math.random() * RELATIONSHIP_ANALYSIS.length)])
		}
	}, [showResults, analysis])

	if (showResults && allDone) {
		return (
			<motion.div
				key="results"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="space-y-10"
			>
				<div className="text-center">
					<h3 className="font-display text-3xl md:text-4xl text-white font-bold mb-2">
						Nuestra Dinámica
					</h3>
					<p className="text-white/60">Resultados finales de la votación</p>
				</div>

				<div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
					<div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
						<div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{santiCount}</div>
						<div className="text-sm font-medium text-white/80 uppercase tracking-wider">Santi</div>
					</div>
					<div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
						<div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">{tefaCount}</div>
						<div className="text-sm font-medium text-white/80 uppercase tracking-wider">Tefa</div>
					</div>
				</div>

				<div className="space-y-4 max-w-lg mx-auto">
					<div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
						<p className="text-white/90 text-lg font-light leading-relaxed text-center italic">
							&ldquo;{analysis || RELATIONSHIP_ANALYSIS[0]}&rdquo;
						</p>
					</div>
				</div>

				<div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<h4 className="text-blue-300/80 text-xs font-bold uppercase tracking-widest px-2 mb-3 text-center md:text-left">Santi es más...</h4>
						{santiWins.slice(0, 8).map((trait, i) => (
							<motion.div
								key={`s-${i}`}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 + i * 0.05 }}
								className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-blue-100 text-sm"
							>
								{trait}
							</motion.div>
						))}
					</div>
					<div className="space-y-2">
						<h4 className="text-pink-300/80 text-xs font-bold uppercase tracking-widest px-2 mb-3 text-center md:text-left">Tefa es más...</h4>
						{tefaWins.slice(0, 8).map((trait, i) => (
							<motion.div
								key={`t-${i}`}
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 + i * 0.05 }}
								className="bg-pink-500/10 border border-pink-500/20 rounded-lg px-4 py-2 text-pink-100 text-sm"
							>
								{trait}
							</motion.div>
						))}
					</div>
				</div>

				<div className="text-center pt-8">
					<button
						onClick={() => window.location.reload()}
						className="text-white/40 hover:text-white transition-colors text-sm"
					>
						Reiniciar dinámica
					</button>
				</div>
			</motion.div>
		)
	}

	return (
		<div className="space-y-12 py-4">
			<div className="text-center">
				<h3 className="font-display text-2xl md:text-3xl text-white font-bold mb-2">
					¿Quién es más...?
				</h3>
				<div className="flex items-center justify-center gap-2 text-white/50 text-xs uppercase tracking-widest font-medium">
					<span>Pregunta {currentIndex + 1} de {total}</span>
				</div>
			</div>

			<div className="flex justify-center gap-1.5 flex-wrap max-w-xs mx-auto">
				{QUIEN_ES_MAS_QUESTIONS.map((_, i) => (
					<div
						key={i}
						className="w-1.5 h-1.5 rounded-full transition-all duration-500"
						style={{
							backgroundColor: i === currentIndex
								? '#fff'
								: votes[i]
									? 'rgba(255,255,255,0.6)'
									: 'rgba(255,255,255,0.1)',
							transform: i === currentIndex ? 'scale(1.5)' : 'scale(1)'
						}}
					/>
				))}
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
					className="text-center"
				>
					<h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-12 px-2 max-w-xl mx-auto leading-tight">
						{question.text}
					</h2>

					<div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md mx-auto">
						<motion.button
							type="button"
							onClick={() => handleVote('santi')}
							className="group relative overflow-hidden px-6 py-8 rounded-2xl font-bold text-xl bg-blue-500/10 border border-blue-500/30 text-blue-100 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Santi
						</motion.button>
						<motion.button
							type="button"
							onClick={() => handleVote('tefa')}
							className="group relative overflow-hidden px-6 py-8 rounded-2xl font-bold text-xl bg-pink-500/10 border border-pink-500/30 text-pink-100 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Tefa
						</motion.button>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
