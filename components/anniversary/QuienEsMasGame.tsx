'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIEN_ES_MAS_QUESTIONS, RELATIONSHIP_TIPS } from '@/constants/anniversary'

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

	// Results: count wins per person per question, build trait labels
	const santiWins = votes
		.map((v, i) => (v === 'santi' ? QUIEN_ES_MAS_QUESTIONS[i].traitSanti : null))
		.filter(Boolean) as string[]
	const tefaWins = votes
		.map((v, i) => (v === 'tefa' ? QUIEN_ES_MAS_QUESTIONS[i].traitTefa : null))
		.filter(Boolean) as string[]

	const santiCount = votes.filter((v) => v === 'santi').length
	const tefaCount = votes.filter((v) => v === 'tefa').length
	const [tip, setTip] = useState('')
	useEffect(() => {
		if (showResults && tip === '') {
			setTip(RELATIONSHIP_TIPS[Math.floor(Math.random() * RELATIONSHIP_TIPS.length)])
		}
	}, [showResults, tip])

	if (showResults && allDone) {
		return (
			<motion.div
				key="results"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="space-y-8"
			>
				<motion.h3
					className="font-display text-2xl md:text-3xl text-white font-bold text-center"
					style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
				>
					Resultados
				</motion.h3>

				{/* Score */}
				<div className="flex justify-center gap-8">
					<div className="text-center">
						<div className="text-4xl md:text-5xl font-bold text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
							{santiCount}
						</div>
						<div className="text-sm md:text-base mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Santi</div>
					</div>
					<div className="text-4xl font-light" style={{ color: 'rgba(255,255,255,0.5)' }}>—</div>
					<div className="text-center">
						<div className="text-4xl md:text-5xl font-bold text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
							{tefaCount}
						</div>
						<div className="text-sm md:text-base mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Tefa</div>
					</div>
				</div>

				{/* Dynamic conclusions */}
				<div className="space-y-3 max-w-md mx-auto">
					{santiWins.slice(0, 5).map((trait, i) => (
						<motion.p
							key={`s-${i}`}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.08 * i }}
							className="text-center text-white/95 text-sm md:text-base"
						>
							Santi es {trait} 😅
						</motion.p>
					))}
					{tefaWins.slice(0, 5).map((trait, i) => (
						<motion.p
							key={`t-${i}`}
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.08 * (i + 5) }}
							className="text-center text-white/95 text-sm md:text-base"
						>
							Tefa es {trait} 💖
						</motion.p>
					))}
				</div>

				{/* Relationship tip */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 max-w-lg mx-auto"
				>
					<p className="text-center text-white/90 text-base md:text-lg font-light leading-relaxed">
						{tip || RELATIONSHIP_TIPS[0]}
					</p>
				</motion.div>
			</motion.div>
		)
	}

	return (
		<div className="space-y-8">
			<h3
				className="font-display text-2xl md:text-3xl text-white font-bold text-center"
				style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
			>
				¿Quién es más...?
			</h3>
			<p className="text-center text-white/80 text-sm md:text-base">
				Voten juntos — sin prisa, sin timer.
			</p>

			{/* Progress */}
			<div className="flex justify-center gap-1 flex-wrap">
				{QUIEN_ES_MAS_QUESTIONS.map((_, i) => (
					<div
						key={i}
						className="w-2 h-2 rounded-full transition-colors"
						style={{
							backgroundColor: votes[i] ? 'rgba(251, 191, 36, 0.9)' : 'rgba(255,255,255,0.2)',
						}}
						aria-hidden
					/>
				))}
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -12 }}
					transition={{ duration: 0.3 }}
					className="text-center"
				>
					<p className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-8 px-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
						{question.text}
					</p>
					<p className="text-sm text-white/60 mb-6">
						{currentIndex + 1} de {total}
					</p>

					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<motion.button
							type="button"
							onClick={() => handleVote('santi')}
							className="px-8 py-4 rounded-xl font-semibold text-lg bg-white/15 border-2 border-white/30 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-colors"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.98 }}
						>
							Santi
						</motion.button>
						<motion.button
							type="button"
							onClick={() => handleVote('tefa')}
							className="px-8 py-4 rounded-xl font-semibold text-lg bg-white/15 border-2 border-white/30 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-colors"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.98 }}
						>
							Tefa
						</motion.button>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
