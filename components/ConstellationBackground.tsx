'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

// ===== PALETA DE COLORES — PROFUNDIDAD CÓSMICA =====
const SKY_COLORS = {
    dawn: {
        top: '#3b82f6',      // Blue 500
        mid: '#6366f1',      // Indigo 500
        bottom: '#8b5cf6',   // Violet 500
    },
    dusk: {
        top: '#1e40af',      // Blue 800
        mid: '#4338ca',      // Indigo 700
        bottom: '#6d28d9',   // Violet 700
    },
    night: {
        top: '#050a14',      // Casi negro
        mid: '#0f172a',      // Slate 900
        bottom: '#1e1b4b',   // Indigo 950
    }
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

// ===== COMPONENTE PRINCIPAL (CANVAS NATIVO OPTIMIZADO) =====
export default function ConstellationBackground({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prefersReducedMotion = useReducedMotion()
    const [isMobile, setIsMobile] = useState(false)

    // Scroll tracking
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

    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
    }, [])

    // ===== TRANSFORMACIONES DE COLOR CSS =====
    const skyTop = useTransform(smoothProgress, [0, 0.4, 1], [SKY_COLORS.dawn.top, SKY_COLORS.dusk.top, SKY_COLORS.night.top])
    const skyMid = useTransform(smoothProgress, [0, 0.4, 1], [SKY_COLORS.dawn.mid, SKY_COLORS.dusk.mid, SKY_COLORS.night.mid])
    const skyBottom = useTransform(smoothProgress, [0, 0.4, 1], [SKY_COLORS.dawn.bottom, SKY_COLORS.dusk.bottom, SKY_COLORS.night.bottom])

    const constellationsOpacity = useTransform(smoothProgress, [0, 0.2, 0.5], [0.3, 0.8, 1])

    // ===== LÓGICA DE PARTÍCULAS (Starfield 3D Simulado) =====
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let width = window.innerWidth
        let height = window.innerHeight

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }
        window.addEventListener('resize', resize)
        resize()

        // Configuración de estrellas
        const starCount = isMobile ? 150 : 400
        const stars: { x: number, y: number, z: number, size: number, speed: number }[] = []

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 2 + 0.5, // Profundidad simulada
                size: Math.random() * 2,
                speed: Math.random() * 0.2 + 0.05
            })
        }

        let mouseX = 0
        let mouseY = 0
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX - width / 2) * 0.05
            mouseY = (e.clientY - height / 2) * 0.05
        }
        window.addEventListener('mousemove', handleMouseMove)

        // Loop de renderizado
        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // Simular parpadeo global (performance hack)
            const time = Date.now() * 0.001

            stars.forEach(star => {
                // Movimiento parallax suave
                star.y -= star.speed

                // Efecto ratón suave
                if (!isMobile) {
                    star.x += (mouseX - (star.x - width / 2) * 0.01) * 0.02
                    star.y += (mouseY - (star.y - height / 2) * 0.01) * 0.02
                }

                // Loop infinito
                if (star.y < -10) star.y = height + 10
                if (star.x < -10) star.x = width + 10
                if (star.x > width + 10) star.x = -10

                // Dibujar
                const opacity = Math.abs(Math.sin(time * star.speed + star.x)) * 0.7 + 0.3
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameId = requestAnimationFrame(render)
        }

        if (!prefersReducedMotion) {
            render()
        }

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [isMobile, prefersReducedMotion])

    // ===== DATOS DE CONSTELACIONES (SVG) =====
    const constellationData = useMemo(() => [
        {
            id: 1, // Corazón Izquierdo
            stars: [{ x: 12, y: 18 }, { x: 8, y: 12 }, { x: 6, y: 8 }, { x: 10, y: 5 }, { x: 14, y: 7 }, { x: 18, y: 5 }, { x: 22, y: 8 }, { x: 20, y: 12 }],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]]
        },
        {
            id: 2, // Osa Mayor (Big Dipper)
            stars: [{ x: 40, y: 45 }, { x: 45, y: 42 }, { x: 52, y: 42 }, { x: 55, y: 38 }, { x: 62, y: 35 }, { x: 68, y: 35 }, { x: 68, y: 28 }, { x: 62, y: 28 }],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]]
        },
        {
            id: 3, // Corazón Derecho
            stars: [{ x: 78, y: 22 }, { x: 74, y: 16 }, { x: 76, y: 11 }, { x: 80, y: 13 }, { x: 84, y: 11 }, { x: 86, y: 16 }],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
        }
    ], [])

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-900">

            {/* CAPA -1: GRADIENTE BASE */}
            <SkyGradientLayer skyTop={skyTop} skyMid={skyMid} skyBottom={skyBottom} />

            {/* CAPA 0: GALAXIA CANVAS NATIVO (Z-INDEX 1) */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-[1] pointer-events-none opacity-80"
            />

            {/* CAPA 1: CONSTELACIONES SVG (Z-INDEX 2) */}
            <motion.div className="fixed inset-0 z-[2] pointer-events-none" style={{ opacity: constellationsOpacity }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {constellationData.map((constellation) => (
                        <g key={constellation.id}>
                            {constellation.connections.map(([from, to], i) => (
                                <motion.line
                                    key={`line-${constellation.id}-${i}`}
                                    x1={constellation.stars[from].x}
                                    y1={constellation.stars[from].y}
                                    x2={constellation.stars[to].x}
                                    y2={constellation.stars[to].y}
                                    stroke="rgba(255, 255, 255, 0.4)"
                                    strokeWidth="0.15"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: "easeInOut" }}
                                />
                            ))}
                            {constellation.stars.map((star, i) => (
                                <motion.circle
                                    key={`star-${constellation.id}-${i}`}
                                    cx={star.x}
                                    cy={star.y}
                                    r={0.6}
                                    fill="white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <animate
                                        attributeName="opacity"
                                        values="0.5;1;0.5"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        begin={`${Math.random() * 2}s`}
                                    />
                                </motion.circle>
                            ))}
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* CAPA 20: CONTENIDO PRINCIPAL */}
            <div className="relative z-[20]">
                {children}
            </div>
        </div>
    )
}
