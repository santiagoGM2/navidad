'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type GamePhase = 'setup' | 'playing' | 'won' | 'lost'

const MAX_ERRORS = 7
const QWERTY_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]

function normalizeChar(c: string): string {
    return c
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
}

export default function AhorcadoGame() {
    const [phase, setPhase] = useState<GamePhase>('setup')
    const [secretWord, setSecretWord] = useState('')
    const [normalizedWord, setNormalizedWord] = useState('')
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
    const [errors, setErrors] = useState(0)
    const [hint1, setHint1] = useState('')
    const [hint2, setHint2] = useState('')
    const [hintsUsed, setHintsUsed] = useState(0)
    const [currentHintText, setCurrentHintText] = useState('')
    const [inputWord, setInputWord] = useState('')
    const [inputHint1, setInputHint1] = useState('')
    const [inputHint2, setInputHint2] = useState('')
    const [shake, setShake] = useState(false)
    const wordInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (phase === 'setup') {
            setTimeout(() => wordInputRef.current?.focus(), 300)
        }
    }, [phase])

    const startGame = useCallback(() => {
        const word = inputWord.trim()
        if (word.length < 2) return

        setSecretWord(word.toUpperCase())
        setNormalizedWord(
            word
                .toUpperCase()
                .split('')
                .map(normalizeChar)
                .join('')
        )
        setHint1(inputHint1.trim())
        setHint2(inputHint2.trim())
        setGuessedLetters(new Set())
        setErrors(0)
        setHintsUsed(0)
        setCurrentHintText('')
        setPhase('playing')
    }, [inputWord, inputHint1, inputHint2])

    const guessLetter = useCallback(
        (letter: string) => {
            if (phase !== 'playing') return
            const norm = normalizeChar(letter)
            if (guessedLetters.has(norm)) return

            const next = new Set(guessedLetters)
            next.add(norm)
            setGuessedLetters(next)

            if (!normalizedWord.includes(norm)) {
                const newErrors = errors + 1
                setErrors(newErrors)
                setShake(true)
                setTimeout(() => setShake(false), 500)
                if (newErrors >= MAX_ERRORS) {
                    setPhase('lost')
                }
            } else {
                const allRevealed = normalizedWord.split('').every((c) => {
                    if (c === ' ' || c === '-') return true
                    return next.has(c)
                })
                if (allRevealed) {
                    setPhase('won')
                }
            }
        },
        [phase, guessedLetters, normalizedWord, errors]
    )

    const useHint = useCallback(() => {
        if (hintsUsed === 0 && hint1) {
            setCurrentHintText(hint1)
            setHintsUsed(1)
        } else if (hintsUsed === 1 && hint2) {
            setCurrentHintText(hint2)
            setHintsUsed(2)
        }
    }, [hintsUsed, hint1, hint2])

    const resetGame = useCallback(() => {
        setPhase('setup')
        setInputWord('')
        setInputHint1('')
        setInputHint2('')
        setSecretWord('')
        setNormalizedWord('')
        setGuessedLetters(new Set())
        setErrors(0)
        setHintsUsed(0)
        setCurrentHintText('')
    }, [])

    const displayWord = secretWord.split('').map((char, i) => {
        const normChar = normalizedWord[i]
        if (char === ' ') return { char: ' ', revealed: true, index: i }
        if (char === '-') return { char: '-', revealed: true, index: i }
        return {
            char,
            revealed: guessedLetters.has(normChar),
            index: i,
        }
    })

    const remainingHints =
        (hint1 ? 1 : 0) + (hint2 ? 1 : 0) - hintsUsed
    const canUseHint = remainingHints > 0 && phase === 'playing'

    return (
        <div className="w-full max-w-lg mx-auto select-none">
            <AnimatePresence mode="wait">
                {phase === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2
                                className="font-display text-2xl md:text-3xl text-white font-bold"
                                style={{
                                    textShadow:
                                        '0 2px 12px rgba(0,0,0,0.4), 0 0 30px rgba(139,92,246,0.2)',
                                }}
                            >
                                Ahorcado
                            </h2>
                            <p className="text-white/60 text-sm">
                                Jugador 1: escribe la palabra secreta y pasa el celular
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                                    Palabra secreta
                                </label>
                                <input
                                    ref={wordInputRef}
                                    type="text"
                                    value={inputWord}
                                    onChange={(e) => setInputWord(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && startGame()}
                                    placeholder="Escribe la palabra..."
                                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-400/50 transition-colors text-lg tracking-wider"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                                    Pista 1 (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={inputHint1}
                                    onChange={(e) => setInputHint1(e.target.value)}
                                    placeholder="Ej: Es un lugar..."
                                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-400/50 transition-colors text-sm"
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                                    Pista 2 (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={inputHint2}
                                    onChange={(e) => setInputHint2(e.target.value)}
                                    placeholder="Ej: Empieza con ..."
                                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-400/50 transition-colors text-sm"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <motion.button
                            onClick={startGame}
                            disabled={inputWord.trim().length < 2}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Comenzar Juego
                        </motion.button>
                    </motion.div>
                )}

                {(phase === 'playing' || phase === 'won' || phase === 'lost') && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Hangman SVG */}
                        <motion.div
                            className="flex justify-center"
                            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <HangmanDrawing errors={errors} maxErrors={MAX_ERRORS} />
                        </motion.div>

                        {/* Error counter */}
                        <div className="flex justify-center items-center gap-2">
                            {Array.from({ length: MAX_ERRORS }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${i < errors
                                            ? 'bg-rose-500 shadow-lg shadow-rose-500/40'
                                            : 'bg-white/10'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Word display */}
                        <div className="flex flex-wrap justify-center gap-2 px-2">
                            {displayWord.map((slot) => (
                                <motion.div
                                    key={slot.index}
                                    className={`flex items-center justify-center ${slot.char === ' '
                                            ? 'w-4'
                                            : 'w-9 h-12 md:w-11 md:h-14 rounded-lg border'
                                        } ${slot.char === ' '
                                            ? ''
                                            : slot.revealed
                                                ? 'bg-violet-500/20 border-violet-400/40'
                                                : 'bg-white/5 border-white/15'
                                        }`}
                                    initial={slot.revealed ? { scale: 1.3 } : {}}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    {slot.char !== ' ' && (
                                        <span
                                            className={`font-bold text-lg md:text-xl ${slot.revealed ? 'text-white' : 'text-transparent'
                                                }`}
                                        >
                                            {slot.revealed || phase === 'lost'
                                                ? slot.char
                                                : '_'}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Hints */}
                        {canUseHint && (
                            <div className="text-center">
                                <button
                                    onClick={useHint}
                                    className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest hover:bg-amber-500/25 transition-all"
                                >
                                    <svg
                                        className="w-4 h-4 inline-block mr-2 -mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                    Usar pista ({remainingHints} restante{remainingHints !== 1 ? 's' : ''})
                                </button>
                            </div>
                        )}

                        <AnimatePresence>
                            {currentHintText && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-center"
                                >
                                    <div className="inline-block px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20">
                                        <p className="text-amber-200/90 text-sm font-medium">
                                            {currentHintText}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Keyboard */}
                        {phase === 'playing' && (
                            <motion.div
                                className="flex flex-col gap-1.5 px-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {QWERTY_ROWS.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex justify-center gap-1.5">
                                        {row.map((letter) => {
                                            const isGuessed = guessedLetters.has(letter)
                                            const isCorrect =
                                                isGuessed && normalizedWord.includes(letter)
                                            const isWrong = isGuessed && !normalizedWord.includes(letter)

                                            return (
                                                <motion.button
                                                    key={letter}
                                                    onClick={() => guessLetter(letter)}
                                                    disabled={isGuessed}
                                                    className={`py-3 px-2 sm:px-3 rounded-lg font-bold text-sm transition-all duration-200 flex-1 max-w-[40px] ${
                                                        isCorrect
                                                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                                                            : isWrong
                                                                ? 'bg-rose-500/20 text-rose-400/50 border border-rose-500/20'
                                                                : 'bg-white/8 text-white/80 border border-white/10 hover:bg-white/15 hover:text-white active:scale-95'
                                                    } disabled:cursor-not-allowed`}
                                                    whileTap={!isGuessed ? { scale: 0.9 } : undefined}
                                                >
                                                    {letter}
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Won / Lost overlay */}
                        <AnimatePresence>
                            {(phase === 'won' || phase === 'lost') && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4 pt-2"
                                >
                                    <div
                                        className={`p-6 rounded-2xl border ${phase === 'won'
                                                ? 'bg-emerald-500/10 border-emerald-400/30'
                                                : 'bg-rose-500/10 border-rose-400/30'
                                            }`}
                                    >
                                        <p
                                            className={`font-bold text-lg ${phase === 'won'
                                                    ? 'text-emerald-300'
                                                    : 'text-rose-300'
                                                }`}
                                        >
                                            {phase === 'won'
                                                ? 'Adivinaste!'
                                                : 'Fin del juego'}
                                        </p>
                                        <p className="text-white/70 text-sm mt-1">
                                            {phase === 'won'
                                                ? 'Excelente trabajo, la palabra era correcta.'
                                                : `La palabra era: ${secretWord}`}
                                        </p>
                                    </div>

                                    <motion.button
                                        onClick={resetGame}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Jugar de nuevo
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function HangmanDrawing({ errors, maxErrors }: { errors: number; maxErrors: number }) {
    const progress = errors / maxErrors
    const baseColor = `rgba(255,255,255,${0.15 + progress * 0.3})`
    const bodyColor =
        errors >= maxErrors
            ? 'rgba(244,63,94,0.9)'
            : `rgba(167,139,250,${0.5 + progress * 0.5})`

    return (
        <svg
            viewBox="0 0 200 220"
            className="w-40 h-44 md:w-48 md:h-52"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Base */}
            <motion.line
                x1="20" y1="200" x2="100" y2="200"
                stroke={baseColor}
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
            />
            {/* Pole */}
            <motion.line
                x1="60" y1="200" x2="60" y2="30"
                stroke={baseColor}
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            />
            {/* Top bar */}
            <motion.line
                x1="60" y1="30" x2="140" y2="30"
                stroke={baseColor}
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            />
            {/* Rope */}
            <motion.line
                x1="140" y1="30" x2="140" y2="55"
                stroke={baseColor}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            />

            {/* Head */}
            {errors >= 1 && (
                <motion.circle
                    cx="140" cy="70" r="15"
                    stroke={bodyColor}
                    strokeWidth="2.5"
                    fill="none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                />
            )}

            {/* Body */}
            {errors >= 2 && (
                <motion.line
                    x1="140" y1="85" x2="140" y2="135"
                    stroke={bodyColor}
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Left arm */}
            {errors >= 3 && (
                <motion.line
                    x1="140" y1="95" x2="120" y2="120"
                    stroke={bodyColor}
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Right arm */}
            {errors >= 4 && (
                <motion.line
                    x1="140" y1="95" x2="160" y2="120"
                    stroke={bodyColor}
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Left leg */}
            {errors >= 5 && (
                <motion.line
                    x1="140" y1="135" x2="120" y2="170"
                    stroke={bodyColor}
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Right leg */}
            {errors >= 6 && (
                <motion.line
                    x1="140" y1="135" x2="160" y2="170"
                    stroke={bodyColor}
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Face (X eyes at death) */}
            {errors >= 7 && (
                <>
                    <motion.line
                        x1="133" y1="65" x2="138" y2="72"
                        stroke="rgba(244,63,94,0.9)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                    />
                    <motion.line
                        x1="138" y1="65" x2="133" y2="72"
                        stroke="rgba(244,63,94,0.9)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                    />
                    <motion.line
                        x1="142" y1="65" x2="147" y2="72"
                        stroke="rgba(244,63,94,0.9)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                    />
                    <motion.line
                        x1="147" y1="65" x2="142" y2="72"
                        stroke="rgba(244,63,94,0.9)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                    />
                </>
            )}
        </svg>
    )
}
