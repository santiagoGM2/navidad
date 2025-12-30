'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { SECRET_LETTER, SECRET_LETTER_PASSWORD } from '@/constants'

interface HeartbeatLetterProps {
    onUnlock?: () => void
}

export default function HeartbeatLetter({ onUnlock }: HeartbeatLetterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [isScrolling, setIsScrolling] = useState(false)
    const [heartbeatSpeed, setHeartbeatSpeed] = useState(1.2)

    const { scrollYProgress } = useScroll()

    // Heart pulses faster when scrolling
    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            setIsScrolling(true)
            setHeartbeatSpeed(0.6) // Faster heartbeat

            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false)
                setHeartbeatSpeed(1.2) // Calm heartbeat
            }, 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(scrollTimeout)
        }
    }, [])

    // When letter opens, heart calms down
    useEffect(() => {
        if (isOpen) {
            setHeartbeatSpeed(2) // Very slow, peaceful
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(false)

        if (password.toLowerCase().trim() === SECRET_LETTER_PASSWORD.toLowerCase()) {
            setIsOpen(true)
            onUnlock?.()
        } else {
            setError(true)
            setPassword('')
        }
    }

    // Envelope glow based on scroll
    const glowIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.9])

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        key="envelope"
                        initial={{ opacity: 0, y: 50, rotateX: -20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative"
                        style={{ perspective: '1000px' }}
                    >
                        {/* Floating envelope with glow */}
                        <motion.div
                            className="relative"
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            {/* Envelope glow */}
                            <motion.div
                                className="absolute -inset-8 rounded-3xl"
                                style={{
                                    background: 'radial-gradient(ellipse at center, rgba(255, 200, 150, 0.3) 0%, transparent 70%)',
                                    opacity: glowIntensity
                                }}
                            />

                            {/* Envelope body */}
                            <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 shadow-2xl border border-amber-200/50">
                                {/* Envelope flap */}
                                <div
                                    className="absolute -top-12 left-0 right-0 h-24 overflow-hidden"
                                    style={{
                                        clipPath: 'polygon(0% 100%, 50% 30%, 100% 100%)',
                                    }}
                                >
                                    <div className="w-full h-full bg-gradient-to-b from-amber-200 to-amber-100 border-t border-l border-r border-amber-300/50 rounded-t-lg" />
                                </div>

                                {/* Wax seal with heart */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                                    <motion.div
                                        className="relative w-20 h-20"
                                        animate={{
                                            scale: [1, 1.08, 1, 1.08, 1],
                                        }}
                                        transition={{
                                            duration: heartbeatSpeed,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                            times: [0, 0.1, 0.2, 0.3, 1]
                                        }}
                                    >
                                        {/* Seal background */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg" />

                                        {/* Seal texture */}
                                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-rose-400 to-rose-600" />

                                        {/* Heart icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.svg
                                                className="w-10 h-10 text-rose-100"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                animate={{
                                                    scale: [1, 1.15, 1, 1.15, 1],
                                                }}
                                                transition={{
                                                    duration: heartbeatSpeed,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                    times: [0, 0.1, 0.2, 0.3, 1]
                                                }}
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </motion.svg>
                                        </div>

                                        {/* Pulse ring */}
                                        <motion.div
                                            className="absolute -inset-2 rounded-full border-2 border-rose-400/50"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.5, 0, 0.5]
                                            }}
                                            transition={{
                                                duration: heartbeatSpeed,
                                                repeat: Infinity,
                                                ease: 'easeOut'
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="mt-8 text-center">
                                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-amber-900 mb-4">
                                        Para ti, mi amor
                                    </h3>

                                    <p className="text-amber-700 mb-8 leading-relaxed">
                                        Esta carta guarda palabras que solo tu debes leer.
                                        <br />
                                        <span className="text-sm opacity-70 mt-2 block">
                                            Ingresa nuestra palabra secreta para abrirla.
                                        </span>
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <motion.input
                                            type="text"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                setError(false)
                                            }}
                                            placeholder="Palabra secreta..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none transition-all bg-white/80 text-amber-900 placeholder-amber-400"
                                        />

                                        <AnimatePresence>
                                            {error && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-rose-500 text-sm"
                                                >
                                                    Esa no es la palabra... intentalo de nuevo.
                                                </motion.p>
                                            )}
                                        </AnimatePresence>

                                        <motion.button
                                            type="submit"
                                            disabled={!password.trim()}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Abrir carta
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="letter-content"
                        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative"
                    >
                        {/* Open letter */}
                        <motion.div
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="relative bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 md:p-12 shadow-2xl border border-amber-100"
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                                    <path
                                        d="M50,10 C60,10 70,15 75,25 C80,35 80,45 75,55 C70,65 60,75 50,85 C40,75 30,65 25,55 C20,45 20,35 25,25 C30,15 40,10 50,10"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-display text-3xl md:text-4xl font-semibold text-amber-900 mb-8 text-center"
                            >
                                {SECRET_LETTER.title}
                            </motion.h2>

                            {/* Letter content */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="prose prose-amber max-w-none"
                            >
                                <p className="text-amber-800 leading-loose whitespace-pre-line text-lg md:text-xl font-serif">
                                    {SECRET_LETTER.content}
                                </p>
                            </motion.div>

                            {/* Heart at bottom */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                                className="mt-12 flex justify-center"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg"
                                >
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
