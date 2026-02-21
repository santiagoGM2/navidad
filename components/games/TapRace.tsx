'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Player {
    id: 'tefa' | 'santi'
    name: string
    color: string
    score: number
    key: string
    icon: string
}

export default function CarreraDeToques() {
    const [gameStarted, setGameStarted] = useState(false)
    const [winner, setWinner] = useState<Player | null>(null)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [players, setPlayers] = useState<Record<'tefa' | 'santi', Player>>({
        tefa: { id: 'tefa', name: 'Tefa', color: '#ec4899', score: 0, key: 'a', icon: '🌸' },
        santi: { id: 'santi', name: 'Santi', color: '#3b82f6', score: 0, key: 'l', icon: '⚡' }
    })

    const WIN_SCORE = 50

    const startGame = () => {
        setWinner(null)
        setPlayers(prev => ({
            tefa: { ...prev.tefa, score: 0 },
            santi: { ...prev.santi, score: 0 }
        }))
        setCountdown(3)
    }

    useEffect(() => {
        if (countdown === null) return
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setGameStarted(true)
            setCountdown(null)
        }
    }, [countdown])

    const handleTap = useCallback((playerId: 'tefa' | 'santi') => {
        if (!gameStarted || winner) return

        setPlayers(prev => {
            const newScore = prev[playerId].score + 1
            if (newScore >= WIN_SCORE && !winner) {
                setWinner(prev[playerId])
                setGameStarted(false)
            }
            return {
                ...prev,
                [playerId]: { ...prev[playerId], score: newScore }
            }
        })
    }, [gameStarted, winner])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'a') handleTap('tefa')
            if (e.key.toLowerCase() === 'l') handleTap('santi')
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleTap])

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8 p-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Carrera de Toques</h2>
                <p className="text-white/60 text-sm">Tefa toca (A) - Santi toca (L)</p>
            </div>

            {!gameStarted && !winner && countdown === null && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-2xl font-bold text-xl shadow-lg"
                >
                    ¡EMPEZAR DUELO!
                </motion.button>
            )}

            <AnimatePresence>
                {countdown !== null && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="text-6xl font-black text-white"
                    >
                        {countdown === 0 ? '¡YA!' : countdown}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Area de Juego */}
            <div className="w-full h-80 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-around p-8">
                {/* Carril Tefa */}
                <div className="relative h-12 flex items-center">
                    <div className="absolute inset-0 bg-pink-500/10 rounded-full" />
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-pink-500/30 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(players.tefa.score / WIN_SCORE) * 100}%` }}
                    />
                    <motion.div
                        className="relative z-10 text-4xl cursor-pointer select-none"
                        animate={{ x: `${(players.tefa.score / WIN_SCORE) * 80}vw` }}
                        style={{ left: 0 }}
                        onClick={() => handleTap('tefa')}
                    >
                        {players.tefa.icon}
                    </motion.div>
                    <div className="absolute right-4 text-pink-300 font-bold opacity-30">META</div>
                </div>

                {/* Carril Santi */}
                <div className="relative h-12 flex items-center">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full" />
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-blue-500/30 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(players.santi.score / WIN_SCORE) * 100}%` }}
                    />
                    <motion.div
                        className="relative z-10 text-4xl cursor-pointer select-none"
                        animate={{ x: `${(players.santi.score / WIN_SCORE) * 80}vw` }}
                        style={{ left: 0 }}
                        onClick={() => handleTap('santi')}
                    >
                        {players.santi.icon}
                    </motion.div>
                    <div className="absolute right-4 text-blue-300 font-bold opacity-30">META</div>
                </div>

                {/* Botones para Touch */}
                <div className="grid grid-cols-2 gap-4 h-24">
                    <button
                        className="bg-pink-500/20 active:bg-pink-500/40 rounded-xl border border-pink-500/30 flex items-center justify-center text-white font-bold md:hidden"
                        onTouchStart={() => handleTap('tefa')}
                    >
                        TAP TEFA
                    </button>
                    <button
                        className="bg-blue-500/20 active:bg-blue-500/40 rounded-xl border border-blue-500/30 flex items-center justify-center text-white font-bold md:hidden"
                        onTouchStart={() => handleTap('santi')}
                    >
                        TAP SANTI
                    </button>
                </div>
            </div>

            {winner && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl"
                >
                    <h3 className="text-3xl font-black text-white mb-2">
                        🏆 ¡GANA {winner.name.toUpperCase()}!
                    </h3>
                    <p className="text-white/70 mb-6">Eres la persona más rápida de esta relación.</p>
                    <button
                        onClick={startGame}
                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        Revancha
                    </button>
                </motion.div>
            )}
        </div>
    )
}
