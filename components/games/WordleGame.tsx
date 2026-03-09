'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

const WORDS = [
	'AMOR', 'BESO', 'VIDA', 'CASA', 'LUNA', 'CIELO', 'SUEÑO',
	'VIAJE', 'MIMO', 'ALMA', 'RISAS', 'DULCE', 'REINA', 'MAGIA',
	'PANDA', 'TIGRE', 'GATOS', 'FLOR'
]

// Usar la fecha actual simplificada como índice del día
const getDailyWord = () => {
	const dayOfYear = Math.floor(
		(Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
	)
	return WORDS[dayOfYear % WORDS.length]
}

const MAX_GUESSES = 6
const KEYBOARD_ROWS = [
	['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
	['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
]

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty'

export default function WordleGame() {
	const [secretWord, setSecretWord] = useState('')
	const [guesses, setGuesses] = useState<string[]>([])
	const [currentGuess, setCurrentGuess] = useState('')
	const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')

	useEffect(() => {
		// Selecciona palabra diaria en el cliente
		setSecretWord(getDailyWord())
	}, [])

	const onKeyPress = useCallback((key: string) => {
		if (gameStatus !== 'playing') return

		if (key === 'ENTER') {
			if (currentGuess.length === secretWord.length) {
				const newGuesses = [...guesses, currentGuess]
				setGuesses(newGuesses)
				setCurrentGuess('')

				if (currentGuess === secretWord) {
					setGameStatus('won')
					triggerVibration([100, 50, 100])
				} else if (newGuesses.length >= MAX_GUESSES) {
					setGameStatus('lost')
				}
			}
		} else if (key === '⌫') {
			setCurrentGuess(prev => prev.slice(0, -1))
		} else {
			if (currentGuess.length < secretWord.length) {
				setCurrentGuess(prev => prev + key)
			}
		}
	}, [currentGuess, gameStatus, guesses, secretWord])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') onKeyPress('ENTER')
			if (e.key === 'Backspace') onKeyPress('⌫')
			if (e.key.match(/^[a-zA-ZñÑ]$/)) onKeyPress(e.key.toUpperCase())
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [onKeyPress])

	const getLetterStatus = (letter: string, index: number, guess: string): LetterStatus => {
		if (!secretWord) return 'empty'
		if (secretWord[index] === letter) return 'correct'
		if (secretWord.includes(letter)) return 'present'
		return 'absent'
	}

	const getKeyStatus = (key: string): LetterStatus => {
		let status: LetterStatus = 'empty'
		guesses.forEach(guess => {
			for (let i = 0; i < guess.length; i++) {
				if (guess[i] === key) {
					const s = getLetterStatus(key, i, guess)
					if (s === 'correct') status = 'correct'
					if (s === 'present' && status !== 'correct') status = 'present'
					if (s === 'absent' && status === 'empty') status = 'absent'
				}
			}
		})
		return status
	}

	if (!secretWord) return null // Wait for client

	return (
		<div className="w-full max-w-sm mx-auto select-none space-y-6">
			<h2 className="font-display text-2xl text-white text-center font-bold" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)', letterSpacing: '2px' }}>
				PALABRITAS DE AMOR
			</h2>
			<p className="text-white/60 text-center text-sm mb-4">Adivina la palabra del día (1 por día)</p>

			<div className="grid gap-2 mb-6">
				{Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
					const guess = guesses[rowIndex]
					const isCurrent = rowIndex === guesses.length
					const wordToRender = guess || (isCurrent ? currentGuess.padEnd(secretWord.length, ' ') : ' '.repeat(secretWord.length))

					return (
						<div key={rowIndex} className="flex gap-2 justify-center">
							{wordToRender.split('').map((letter, colIndex) => {
								let status: LetterStatus = 'empty'
								if (guess) {
									status = getLetterStatus(letter, colIndex, guess)
								}

								return (
									<motion.div
										key={colIndex}
										initial={guess ? { rotateX: 90 } : {}}
										animate={guess ? { rotateX: 0 } : {}}
										transition={{ duration: 0.5, delay: colIndex * 0.1 }}
										className={`w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center font-bold text-xl sm:text-2xl rounded-xl transition-colors
											${status === 'correct' ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
												status === 'present' ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
													status === 'absent' ? 'bg-white/10 border-white/10 text-white/50' :
														letter !== ' ' ? 'border-2 border-violet-400 bg-white/5 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)] scale-105' :
															'border-2 border-white/20 bg-transparent text-white'
											}`}
									>
										{letter !== ' ' ? letter : ''}
									</motion.div>
								)
							})}
						</div>
					)
				})}
			</div>

			<AnimatePresence>
				{gameStatus !== 'playing' && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
					>
						<p className="text-2xl font-bold mb-2 text-white">
							{gameStatus === 'won' ? '¡Eres increíble!' : '¡Oops!'}
						</p>
						<p className="text-white/80">
							La palabra era: <span className="font-bold text-violet-300">{secretWord}</span>
						</p>
						<p className="text-white/50 text-sm mt-4">Vuelve mañana para otra palabra especial.</p>
					</motion.div>
				)}
			</AnimatePresence>

			{gameStatus === 'playing' && (
				<div className="flex flex-col gap-2 relative z-50">
					{KEYBOARD_ROWS.map((row, i) => (
						<div key={i} className="flex justify-center gap-1.5 sm:gap-2">
							{row.map(key => {
								const status = getKeyStatus(key)
								return (
									<button
										key={key}
										onClick={() => onKeyPress(key)}
										className={`h-12 flex items-center justify-center rounded-lg font-bold transition-all sm:text-sm text-xs
											${key === 'ENTER' || key === '⌫' ? 'px-3 sm:px-4 text-xs' : 'flex-1 max-w-[40px]'}
											${status === 'correct' ? 'bg-emerald-500 text-white shadow-md' :
												status === 'present' ? 'bg-amber-500 text-white shadow-md' :
													status === 'absent' ? 'bg-white/5 text-white/30' :
														'bg-white/20 text-white hover:bg-white/30 active:scale-95'
											}`}
									>
										{key}
									</button>
								)
							})}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
