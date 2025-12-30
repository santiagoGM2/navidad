'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * ConstellationBackground - Sistema de Fondo de Constelaciones
 * 
 * CONCEPTO: Transición progresiva de día a noche
 * 
 * INICIO (scroll 0%): Cielo claro, tipo atardecer temprano
 * - Fondo claro/cálido
 * - Constelaciones apenas visibles
 * - Pocos puntos de luz
 * 
 * PROGRESIÓN (scroll 0-100%):
 * - Fondo oscurece gradualmente
 * - Más estrellas aparecen
 * - Constelaciones brillan más
 * - Estrellas fugaces ocasionales
 * 
 * FINAL (scroll 100%): Noche profunda
 * - Cielo oscuro estrellado
 * - Constelaciones brillantes
 * - Máxima inmersión
 */

// ===== PALETA DE COLORES — TRANSICIÓN DÍA → NOCHE =====
const SKY_COLORS = {
    dawn: {
        top: '#87CEEB',      // Cielo azul claro
        mid: '#B4D7E8',      // Azul pálido
        bottom: '#E8C4A0',   // Dorado suave
    },
    dusk: {
        top: '#4A6B8A',      // Azul crepuscular
        mid: '#5D4E6D',      // Púrpura suave
        bottom: '#8B6B5B',   // Naranja atenuado
    },
    night: {
        top: '#0a0a1a',      // Negro azulado
        mid: '#0d0d25',      // Azul muy oscuro
        bottom: '#12122a',   // Púrpura muy oscuro
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
    appearAt: number // Momento del scroll en que aparece (0-1)
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

    // Detección de móvil
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // ===== SISTEMA DE ESTRELLAS FUGACES =====
    useEffect(() => {
        const createShootingStar = () => {
            const newStar: ShootingStar = {
                id: Date.now(),
                startX: Math.random() * 80 + 10, // 10-90%
                startY: Math.random() * 40, // 0-40% (parte superior)
                angle: Math.random() * 30 + 15, // 15-45 grados
                length: Math.random() * 80 + 60, // Longitud del trazo
                duration: Math.random() * 1 + 0.5, // 0.5-1.5 segundos
                delay: 0
            }

            setShootingStars(prev => [...prev.slice(-2), newStar]) // Máximo 3 a la vez

            // Limpiar después de la animación
            setTimeout(() => {
                setShootingStars(prev => prev.filter(s => s.id !== newStar.id))
            }, newStar.duration * 1000 + 500)
        }

        // Intervalo aleatorio para estrellas fugaces (cada 4-10 segundos)
        const scheduleNext = () => {
            const delay = Math.random() * 6000 + 4000
            return setTimeout(() => {
                createShootingStar()
                scheduleNext()
            }, delay)
        }

        const timeoutId = scheduleNext()
        return () => clearTimeout(timeoutId)
    }, [])

    // ===== TRANSFORMACIONES DE COLOR =====
    const skyTop = useTransform(
        smoothProgress,
        [0, 0.3, 0.6, 1],
        [SKY_COLORS.dawn.top, SKY_COLORS.dusk.top, SKY_COLORS.night.top, SKY_COLORS.night.top]
    )

    const skyMid = useTransform(
        smoothProgress,
        [0, 0.3, 0.6, 1],
        [SKY_COLORS.dawn.mid, SKY_COLORS.dusk.mid, SKY_COLORS.night.mid, SKY_COLORS.night.mid]
    )

    const skyBottom = useTransform(
        smoothProgress,
        [0, 0.3, 0.6, 1],
        [SKY_COLORS.dawn.bottom, SKY_COLORS.dusk.bottom, SKY_COLORS.night.bottom, SKY_COLORS.night.bottom]
    )

    // Opacidad global de estrellas
    const starsOpacity = useTransform(smoothProgress, [0, 0.2, 0.5, 1], [0.15, 0.4, 0.8, 1])

    // Opacidad de constelaciones
    const constellationsOpacity = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [0.1, 0.3, 0.6, 0.85])

    // Brillo de estrellas fugaces
    const shootingStarsOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0, 0.5, 1])

    // ===== GENERACIÓN DE ESTRELLAS =====
    const stars = useMemo((): Star[] => {
        const count = isMobile ? 120 : 300
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2.5 + 0.5,
            baseOpacity: Math.random() * 0.6 + 0.4,
            twinkleSpeed: Math.random() * 4 + 2,
            delay: Math.random() * 5,
            appearAt: Math.random() * 0.6 // Algunas aparecen antes, otras después
        }))
    }, [isMobile])

    // ===== CONSTELACIONES EN FORMA DE CORAZÓN =====
    const constellations = useMemo((): Constellation[] => [
        // Corazón 1 - Superior izquierda (grande)
        {
            id: 1,
            stars: [
                { x: 12, y: 18 },  // Punta inferior
                { x: 8, y: 12 },   // Curva izquierda baja
                { x: 6, y: 8 },    // Curva izquierda alta
                { x: 10, y: 5 },   // Lóbulo izquierdo
                { x: 14, y: 7 },   // Centro superior
                { x: 18, y: 5 },   // Lóbulo derecho
                { x: 22, y: 8 },   // Curva derecha alta
                { x: 20, y: 12 },  // Curva derecha baja
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
            appearAt: 0.2
        },
        // Corazón 2 - Superior derecha (mediano)
        {
            id: 2,
            stars: [
                { x: 78, y: 22 },  // Punta inferior
                { x: 74, y: 16 },  // Curva izquierda
                { x: 76, y: 11 },  // Lóbulo izquierdo
                { x: 80, y: 13 },  // Centro superior
                { x: 84, y: 11 },  // Lóbulo derecho
                { x: 86, y: 16 },  // Curva derecha
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
            appearAt: 0.25
        },
        // Corazón 3 - Centro (pequeño)
        {
            id: 3,
            stars: [
                { x: 50, y: 35 },  // Punta inferior
                { x: 47, y: 30 },  // Curva izquierda
                { x: 48, y: 26 },  // Lóbulo izquierdo
                { x: 52, y: 26 },  // Lóbulo derecho
                { x: 53, y: 30 },  // Curva derecha
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
            appearAt: 0.3
        },
        // Corazón 4 - Izquierda medio (pequeño)
        {
            id: 4,
            stars: [
                { x: 25, y: 50 },  // Punta inferior
                { x: 22, y: 45 },  // Curva izquierda
                { x: 23, y: 41 },  // Lóbulo izquierdo
                { x: 27, y: 41 },  // Lóbulo derecho
                { x: 28, y: 45 },  // Curva derecha
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
            appearAt: 0.35
        },
        // Corazón 5 - Derecha abajo (mediano)
        {
            id: 5,
            stars: [
                { x: 85, y: 55 },  // Punta inferior
                { x: 81, y: 49 },  // Curva izquierda
                { x: 83, y: 44 },  // Lóbulo izquierdo
                { x: 87, y: 46 },  // Centro
                { x: 91, y: 44 },  // Lóbulo derecho
                { x: 93, y: 49 },  // Curva derecha
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
            appearAt: 0.4
        },
        // Corazón 6 - Inferior izquierda (pequeño)
        {
            id: 6,
            stars: [
                { x: 15, y: 70 },  // Punta inferior
                { x: 12, y: 65 },  // Curva izquierda
                { x: 13, y: 61 },  // Lóbulo izquierdo
                { x: 17, y: 61 },  // Lóbulo derecho
                { x: 18, y: 65 },  // Curva derecha
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
            appearAt: 0.45
        }
    ], [])

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden">

            {/* ===== CAPA 0: CIELO GRADIENTE ===== */}
            <motion.div
                className="fixed inset-0 z-0"
                style={{
                    background: useTransform(
                        [skyTop, skyMid, skyBottom],
                        ([top, mid, bottom]) =>
                            `linear-gradient(180deg, ${top} 0%, ${mid} 50%, ${bottom} 100%)`
                    )
                }}
            />

            {/* ===== CAPA 1: ESTRELLAS INDIVIDUALES ===== */}
            <motion.div
                className="fixed inset-0 z-[1] pointer-events-none"
                style={{ opacity: starsOpacity }}
            >
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            backgroundColor: '#ffffff',
                            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                        }}
                        animate={{
                            opacity: [star.baseOpacity * 0.3, star.baseOpacity, star.baseOpacity * 0.3],
                            scale: [0.9, 1.1, 0.9]
                        }}
                        transition={{
                            duration: star.twinkleSpeed,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: 'easeInOut'
                        }}
                    />
                ))}
            </motion.div>

            {/* ===== CAPA 2: CONSTELACIONES ===== */}
            <motion.div
                className="fixed inset-0 z-[2] pointer-events-none"
                style={{ opacity: constellationsOpacity }}
            >
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {constellations.map((constellation) => (
                        <g key={constellation.id}>
                            {/* Líneas conectoras */}
                            {constellation.connections.map(([from, to], i) => (
                                <motion.line
                                    key={`${constellation.id}-line-${i}`}
                                    x1={constellation.stars[from].x}
                                    y1={constellation.stars[from].y}
                                    x2={constellation.stars[to].x}
                                    y2={constellation.stars[to].y}
                                    stroke="rgba(255, 255, 255, 0.25)"
                                    strokeWidth="0.08"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{
                                        pathLength: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                                        opacity: { duration: 1.5 }
                                    }}
                                />
                            ))}
                            {/* Estrellas de la constelación */}
                            {constellation.stars.map((star, i) => (
                                <motion.circle
                                    key={`${constellation.id}-star-${i}`}
                                    cx={star.x}
                                    cy={star.y}
                                    r="0.35"
                                    fill="white"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        r: [0.25, 0.4, 0.25]
                                    }}
                                    transition={{
                                        duration: 2.5 + i * 0.2,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: 'easeInOut'
                                    }}
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* ===== CAPA 3: ESTRELLAS FUGACES ===== */}
            <motion.div
                className="fixed inset-0 z-[3] pointer-events-none overflow-hidden"
                style={{ opacity: shootingStarsOpacity }}
            >
                {shootingStars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute"
                        style={{
                            left: `${star.startX}%`,
                            top: `${star.startY}%`,
                            width: star.length,
                            height: 2,
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 30%, transparent 100%)',
                            borderRadius: '2px',
                            transformOrigin: 'left center',
                            transform: `rotate(${star.angle}deg)`,
                            filter: 'blur(0.5px)'
                        }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scaleX: [0, 1, 1, 1],
                            x: [0, star.length * 1.5]
                        }}
                        transition={{
                            duration: star.duration,
                            ease: 'easeOut'
                        }}
                    />
                ))}
            </motion.div>

            {/* ===== CAPA 4: BRILLO ATMOSFÉRICO ===== */}
            <motion.div
                className="fixed inset-0 z-[4] pointer-events-none"
                style={{
                    opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.1, 0])
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255, 200, 150, 0.15) 0%, transparent 60%)'
                    }}
                />
            </motion.div>

            {/* ===== CAPA 5: VIGNETTE SUTIL ===== */}
            <div
                className="fixed inset-0 z-[5] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.15) 100%)'
                }}
            />

            {/* ===== CONTENIDO PRINCIPAL ===== */}
            <div className="relative z-[10]">
                {children}
            </div>
        </div>
    )
}
