'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// ===== PALETA DE COLORES — PROFUNDIDAD CÓSMICA =====
const SKY_COLORS = {
    // Estado inicial: Azul medianoche profundo con toque místico
    dawn: {
        top: '#0f172a',      // Slate 900
        mid: '#1e1b4b',      // Indigo 950
        bottom: '#312e81',   // Indigo 900
    },
    // Estado medio: Transición a violeta intenso
    dusk: {
        top: '#020617',      // Slate 950
        mid: '#2e1065',      // Violet 950
        bottom: '#581c87',   // Purple 800 - Un poco más vibrante
    },
    // Estado final: Abismo estrellado
    night: {
        top: '#000000',      // Negro puro
        mid: '#0f0518',      // Casi negro
        bottom: '#172554',   // Blue 950 - Contraste sutil
    }
}

// ===== INTERFACES =====
interface Star {
    id: number
    x: number
    y: number
    size: number
    baseOpacity: number
    twinkleSpeed: number
    delay: number
}

interface ConstellationStar {
    x: number
    y: number
}

interface Constellation {
    id: number
    stars: ConstellationStar[]
    connections: [number, number][]
    appearAt: number
}

interface ShootingStar {
    id: number
    startX: number
    startY: number
    angle: number
    length: number
    duration: number
    delay: number
}

// ===== COMPONENTE PARA GRADIENTE DEL CIELO =====
function SkyGradientLayer({ 
    skyTop, 
    skyMid, 
    skyBottom 
}: { 
    skyTop: any
    skyMid: any
    skyBottom: any
}) {
    const gradient = useTransform(
        [skyTop, skyMid, skyBottom],
        ([top, mid, bottom]) => `linear-gradient(180deg, ${top} 0%, ${mid} 50%, ${bottom} 100%)`
    )
    
    return (
        <motion.div
            className="fixed inset-0 z-0"
            style={{ background: gradient }}
        />
    )
}

// ===== COMPONENTE PRINCIPAL =====
export default function ConstellationBackground({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

    // Scroll tracking con física suave
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        mass: 0.5,
        restDelta: 0.0001
    })

    // Detección de móvil y re-renderizado seguro
    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
        const check = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // ===== SISTEMA DE ESTRELLAS FUGACES =====
    useEffect(() => {
        const createShootingStar = () => {
            const newStar: ShootingStar = {
                id: Date.now(),
                startX: Math.random() * 80 + 10,
                startY: Math.random() * 40,
                angle: Math.random() * 30 + 15,
                length: Math.random() * 80 + 60,
                duration: Math.random() * 1 + 0.5,
                delay: 0
            }

            setShootingStars(prev => [...prev.slice(-2), newStar])

            setTimeout(() => {
                setShootingStars(prev => prev.filter(s => s.id !== newStar.id))
            }, newStar.duration * 1000 + 500)
        }

        const scheduleNext = () => {
            const delay = Math.random() * 4000 + 3000 // Más frecuentes
            return setTimeout(() => {
                createShootingStar()
                scheduleNext()
            }, delay)
        }

        const timeoutId = scheduleNext()
        return () => clearTimeout(timeoutId)
    }, [])

    // ===== TRANSFORMACIONES DE COLOR =====
    const skyTop = useTransform(smoothProgress, [0, 0.5, 1], [SKY_COLORS.dawn.top, SKY_COLORS.dusk.top, SKY_COLORS.night.top])
    const skyMid = useTransform(smoothProgress, [0, 0.5, 1], [SKY_COLORS.dawn.mid, SKY_COLORS.dusk.mid, SKY_COLORS.night.mid])
    const skyBottom = useTransform(smoothProgress, [0, 0.5, 1], [SKY_COLORS.dawn.bottom, SKY_COLORS.dusk.bottom, SKY_COLORS.night.bottom])

    const starsOpacity = useTransform(smoothProgress, [0, 0.2], [0.8, 1]) // Siempre visibles
    const constellationsOpacity = useTransform(smoothProgress, [0, 0.3], [0.4, 0.8]) // Más visibles

    // ===== GENERACIÓN DE ESTRELLAS =====
    // Optimización: Reducir número de estrellas en móvil para mejor rendimiento
    const stars = useMemo((): Star[] => {
        // Reducir estrellas en móvil para mejorar rendimiento
        const count = isMobile ? 100 : 200
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1, // Un poco más grandes
            baseOpacity: Math.random() * 0.5 + 0.3,
            twinkleSpeed: Math.random() * 3 + 2,
            delay: Math.random() * 5
        }))
    }, [isMobile])

    // ===== CONSTELACIONES EN FORMA DE CORAZÓN =====
    const constellations = useMemo((): Constellation[] => [
        {
            id: 1,
            stars: [
                { x: 12, y: 18 }, { x: 8, y: 12 }, { x: 6, y: 8 }, { x: 10, y: 5 },
                { x: 14, y: 7 }, { x: 18, y: 5 }, { x: 22, y: 8 }, { x: 20, y: 12 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
            appearAt: 0
        },
        {
            id: 2,
            stars: [
                { x: 78, y: 22 }, { x: 74, y: 16 }, { x: 76, y: 11 }, { x: 80, y: 13 },
                { x: 84, y: 11 }, { x: 86, y: 16 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
            appearAt: 0
        },
        // Más corazones distribuidos...
        {
            id: 3,
            stars: [
                { x: 50, y: 35 }, { x: 47, y: 30 }, { x: 48, y: 26 }, { x: 52, y: 26 }, { x: 53, y: 30 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
            appearAt: 0
        }
    ], [])

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-900">

            {/* ===== CAPA 0: CIELO GRADIENTE ===== */}
            <SkyGradientLayer skyTop={skyTop} skyMid={skyMid} skyBottom={skyBottom} />

            {/* ===== CAPA 1: ESTRELLAS ===== */}
            <motion.div className="fixed inset-0 z-[1] pointer-events-none" style={{ opacity: starsOpacity }}>
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.8)`
                        }}
                        animate={{
                            opacity: [star.baseOpacity, 1, star.baseOpacity],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: star.twinkleSpeed,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </motion.div>

            {/* ===== CAPA 2: CONSTELACIONES ===== */}
            <motion.div className="fixed inset-0 z-[2] pointer-events-none" style={{ opacity: constellationsOpacity }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {constellations.map((constellation) => (
                        <g key={constellation.id}>
                            {/* Líneas */}
                            {constellation.connections.map(([from, to], i) => (
                                <motion.line
                                    key={`line-${constellation.id}-${i}`}
                                    x1={constellation.stars[from].x}
                                    y1={constellation.stars[from].y}
                                    x2={constellation.stars[to].x}
                                    y2={constellation.stars[to].y}
                                    stroke="rgba(255, 255, 255, 0.2)"
                                    strokeWidth="0.1"
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                />
                            ))}
                            {/* Estrellas */}
                            {constellation.stars.map((star, i) => (
                                <motion.circle
                                    key={`star-${constellation.id}-${i}`}
                                    cx={star.x}
                                    cy={star.y}
                                    r={0.4} // Valor estático seguro
                                    fill="white"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* ===== CAPA 3: ESTRELLAS FUGACES ===== */}
            <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden">
                {shootingStars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute h-[2px] rounded-full bg-gradient-to-r from-white via-white/50 to-transparent"
                        style={{
                            left: `${star.startX}%`,
                            top: `${star.startY}%`,
                            width: star.length,
                            rotate: star.angle
                        }}
                        initial={{ opacity: 0, x: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: star.length * 2
                        }}
                        transition={{ duration: star.duration, ease: "easeOut" }}
                    />
                ))}
            </div>

            {/* ===== CONTENIDO ===== */}
            <div className="relative z-[10]">
                {children}
            </div>
        </div>
    )
}
