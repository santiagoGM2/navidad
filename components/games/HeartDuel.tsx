'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Entity {
    x: number
    y: number
    angle: number
    score: number
}

export default function HeartDuel() {
    const [gameStarted, setGameStarted] = useState(false)
    const [winner, setWinner] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [p1, setP1] = useState<Entity>({ x: 100, y: 150, angle: 0, score: 0 })
    const [p2, setP2] = useState<Entity>({ x: 500, y: 150, angle: Math.PI, score: 0 })

    const keys = useRef<Set<string>>(new Set())

    const resetGame = () => {
        setWinner(null)
        setP1({ x: 100, y: 150, angle: 0, score: 0 })
        setP2({ x: 500, y: 150, angle: Math.PI, score: 0 })
        setGameStarted(true)
    }

    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase())
        const handleUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase())
        window.addEventListener('keydown', handleDown)
        window.addEventListener('keyup', handleUp)
        return () => {
            window.removeEventListener('keydown', handleDown)
            window.removeEventListener('keyup', handleUp)
        }
    }, [])

    useEffect(() => {
        if (!gameStarted || winner) return

        let lastTime = performance.now()
        let requestRef: number

        const update = (time: number) => {
            const dt = (time - lastTime) / 1000
            lastTime = time

            // P1 Controls (WASD)
            if (keys.current.has('w')) {
                setP1(p => ({
                    ...p,
                    x: Math.max(20, Math.min(580, p.x + Math.cos(p.angle) * 150 * dt)),
                    y: Math.max(20, Math.min(280, p.y + Math.sin(p.angle) * 150 * dt))
                }))
            }
            if (keys.current.has('a')) setP1(p => ({ ...p, angle: p.angle - 3 * dt }))
            if (keys.current.has('d')) setP1(p => ({ ...p, angle: p.angle + 3 * dt }))

            // P2 Controls (Arrows)
            if (keys.current.has('arrowup')) {
                setP2(p => ({
                    ...p,
                    x: Math.max(20, Math.min(580, p.x + Math.cos(p.angle) * 150 * dt)),
                    y: Math.max(20, Math.min(280, p.y + Math.sin(p.angle) * 150 * dt))
                }))
            }
            if (keys.current.has('arrowleft')) setP2(p => ({ ...p, angle: p.angle - 3 * dt }))
            if (keys.current.has('arrowright')) setP2(p => ({ ...p, angle: p.angle + 3 * dt }))

            // Draw
            const canvas = canvasRef.current
            if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    // Draw P1 (Pink)
                    ctx.save()
                    ctx.translate(p1.x, p1.y)
                    ctx.rotate(p1.angle)
                    ctx.font = '30px serif'
                    ctx.fillText('🌸', -15, 10)
                    ctx.restore()

                    // Draw P2 (Blue)
                    ctx.save()
                    ctx.translate(p2.x, p2.y)
                    ctx.rotate(p2.angle)
                    ctx.font = '30px serif'
                    ctx.fillText('⚡', -15, 10)
                    ctx.restore()
                }
            }

            requestRef = requestAnimationFrame(update)
        }

        requestRef = requestAnimationFrame(update)
        return () => cancelAnimationFrame(requestRef)
    }, [gameStarted, winner, p1.x, p1.y, p1.angle, p2.x, p2.y, p2.angle])

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">Duelo de Besos</h2>
                <p className="text-white/60 text-xs">P1: WASD | P2: Flechas</p>
            </div>

            {!gameStarted && (
                <button onClick={resetGame} className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold font-display">
                    Jugar Duelo
                </button>
            )}

            <div className="relative border-4 border-white/10 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={300}
                    className="w-full max-w-full h-auto aspect-[2/1]"
                />

                {/* Controles Touch Mobile */}
                <div className="md:hidden grid grid-cols-2 gap-4 p-4 bg-white/5 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-1">
                        <div />
                        <button className="h-10 bg-white/10 rounded" onTouchStart={() => keys.current.add('w')} onTouchEnd={() => keys.current.delete('w')}>↑</button>
                        <div />
                        <button className="h-10 bg-white/10 rounded" onTouchStart={() => keys.current.add('a')} onTouchEnd={() => keys.current.delete('a')}>←</button>
                        <div />
                        <button className="h-10 bg-white/10 rounded" onTouchStart={() => keys.current.add('d')} onTouchEnd={() => keys.current.delete('d')}>→</button>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        <div />
                        <button className="h-10 bg-white/10 rounded" onTouchStart={() => keys.current.add('arrowup')} onTouchEnd={() => keys.current.delete('arrowup')}>↑</button>
                        <div />
                        <button className="h-10 bg-white/10 rounded" onTouchStart={() => keys.current.add('arrowleft')} onTouchEnd={() => keys.current.delete('arrowleft')}>←</button>
                        <div />
                        <button className="h-10 bg-white/10 rounded" onTouchStart={() => keys.current.add('arrowright')} onTouchEnd={() => keys.current.delete('arrowright')}>→</button>
                    </div>
                </div>
            </div>

            <p className="text-white/40 text-xs text-center italic">
                Un duelo amistoso donde sus íconos se mueven por la arena.
            </p>
        </div>
    )
}
