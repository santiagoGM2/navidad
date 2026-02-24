'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type GamePhase = 'menu' | 'waiting' | 'playing' | 'finished'
type PlayerRole = 'host' | 'guest' | null

interface Vec2 {
    x: number
    y: number
}

interface Ball {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    r: number
    color: string
    pocketed: boolean
    type: 'cue' | 'solid' | 'stripe'
}

const TABLE_W = 800
const TABLE_H = 400
const BALL_R = 10
const POCKET_R = 18
const FRICTION = 0.985
const MIN_VEL = 0.15
const MAX_POWER = 18
const CUE_COLOR = '#F5F5F5'

const POCKETS: Vec2[] = [
    { x: POCKET_R, y: POCKET_R },
    { x: TABLE_W / 2, y: POCKET_R - 4 },
    { x: TABLE_W - POCKET_R, y: POCKET_R },
    { x: POCKET_R, y: TABLE_H - POCKET_R },
    { x: TABLE_W / 2, y: TABLE_H - POCKET_R + 4 },
    { x: TABLE_W - POCKET_R, y: TABLE_H - POCKET_R },
]

const BALL_COLORS: { color: string; type: 'solid' | 'stripe' }[] = [
    { color: '#FBBF24', type: 'solid' },
    { color: '#3B82F6', type: 'solid' },
    { color: '#EF4444', type: 'solid' },
    { color: '#8B5CF6', type: 'solid' },
    { color: '#F97316', type: 'solid' },
    { color: '#10B981', type: 'solid' },
    { color: '#A855F7', type: 'solid' },
    { color: '#EC4899', type: 'stripe' },
    { color: '#6366F1', type: 'stripe' },
    { color: '#14B8A6', type: 'stripe' },
    { color: '#F59E0B', type: 'stripe' },
    { color: '#DC2626', type: 'stripe' },
    { color: '#7C3AED', type: 'stripe' },
    { color: '#2563EB', type: 'stripe' },
]

function generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
}

function createInitialBalls(): Ball[] {
    const balls: Ball[] = []

    balls.push({
        id: 0,
        x: TABLE_W * 0.25,
        y: TABLE_H / 2,
        vx: 0,
        vy: 0,
        r: BALL_R,
        color: CUE_COLOR,
        pocketed: false,
        type: 'cue',
    })

    const startX = TABLE_W * 0.68
    const startY = TABLE_H / 2
    const d = BALL_R * 2.1
    let ballIndex = 0

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
            if (ballIndex >= BALL_COLORS.length) break
            const x = startX + row * d * Math.cos(Math.PI / 6)
            const y = startY + (col - row / 2) * d + (Math.random() - 0.5) * 0.5
            balls.push({
                id: ballIndex + 1,
                x,
                y,
                vx: 0,
                vy: 0,
                r: BALL_R,
                color: BALL_COLORS[ballIndex].color,
                pocketed: false,
                type: BALL_COLORS[ballIndex].type,
            })
            ballIndex++
        }
    }

    return balls
}

function dist(a: Vec2, b: Vec2): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
    if (ball.pocketed) return

    ctx.save()

    // Shadow
    ctx.beginPath()
    ctx.arc(ball.x + 2, ball.y + 2, ball.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill()

    // Ball body
    if (ball.type === 'stripe') {
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
        ctx.fillStyle = '#F5F5F5'
        ctx.fill()

        ctx.save()
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
        ctx.clip()
        ctx.fillStyle = ball.color
        ctx.fillRect(ball.x - ball.r, ball.y - ball.r * 0.4, ball.r * 2, ball.r * 0.8)
        ctx.restore()
    } else {
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
        ctx.fillStyle = ball.color
        ctx.fill()
    }

    // Shine
    const shineGrad = ctx.createRadialGradient(
        ball.x - ball.r * 0.3,
        ball.y - ball.r * 0.3,
        0,
        ball.x,
        ball.y,
        ball.r
    )
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.4)')
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.fillStyle = shineGrad
    ctx.fill()

    // Ball number
    if (ball.type !== 'cue') {
        ctx.fillStyle = ball.type === 'stripe' ? '#111' : 'rgba(255,255,255,0.9)'
        ctx.font = `bold ${ball.r * 0.8}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(ball.id), ball.x, ball.y)
    }

    ctx.restore()
}

export default function BillarOnline() {
    const [phase, setPhase] = useState<GamePhase>('menu')
    const [role, setRole] = useState<PlayerRole>(null)
    const [roomCode, setRoomCode] = useState('')
    const [inputCode, setInputCode] = useState('')
    const [error, setError] = useState('')
    const [balls, setBalls] = useState<Ball[]>([])
    const [turn, setTurn] = useState<'host' | 'guest'>('host')
    const [aiming, setAiming] = useState(false)
    const [aimStart, setAimStart] = useState<Vec2 | null>(null)
    const [aimEnd, setAimEnd] = useState<Vec2 | null>(null)
    const [isSimulating, setIsSimulating] = useState(false)
    const [pocketedHost, setPocketedHost] = useState<Ball[]>([])
    const [pocketedGuest, setPocketedGuest] = useState<Ball[]>([])
    const [winner, setWinner] = useState<string | null>(null)
    const [opponentConnected, setOpponentConnected] = useState(false)
    const [playerName, setPlayerName] = useState('')
    const [opponentName, setOpponentName] = useState('')

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animFrameRef = useRef<number>(0)
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
    const ballsRef = useRef<Ball[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    const isMyTurn = role === turn && !isSimulating

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/session')
                if (res.ok) {
                    const data = await res.json()
                    setPlayerName(data.user || 'Jugador')
                }
            } catch { /* ignore */ }
        }
        checkSession()
    }, [])

    const setupChannel = useCallback(
        (code: string) => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
            }

            const channel = supabase.channel(`billar-${code}`, {
                config: { broadcast: { self: false } },
            })

            channel
                .on('broadcast', { event: 'player-join' }, (payload: any) => {
                    setOpponentConnected(true)
                    setOpponentName(payload.payload?.name || 'Rival')
                    if (role === 'host') {
                        const initBalls = createInitialBalls()
                        channel.send({
                            type: 'broadcast',
                            event: 'game-start',
                            payload: {
                                balls: initBalls,
                                turn: 'host',
                                hostName: playerName,
                            },
                        })
                        setBalls(initBalls)
                        ballsRef.current = initBalls
                        setTurn('host')
                        setPhase('playing')
                    }
                })
                .on('broadcast', { event: 'game-start' }, (payload: any) => {
                    setBalls(payload.payload.balls)
                    ballsRef.current = payload.payload.balls
                    setTurn(payload.payload.turn)
                    setOpponentName(payload.payload.hostName || 'Rival')
                    setPhase('playing')
                })
                .on('broadcast', { event: 'shot' }, (payload: any) => {
                    const { ballId, vx, vy } = payload.payload
                    setBalls((prev) => {
                        const next = prev.map((b) =>
                            b.id === ballId ? { ...b, vx, vy } : b
                        )
                        ballsRef.current = next
                        return next
                    })
                    setIsSimulating(true)
                })
                .on('broadcast', { event: 'turn-end' }, (payload: any) => {
                    setTurn(payload.payload.nextTurn)
                    if (payload.payload.balls) {
                        setBalls(payload.payload.balls)
                        ballsRef.current = payload.payload.balls
                    }
                    if (payload.payload.pocketedHost)
                        setPocketedHost(payload.payload.pocketedHost)
                    if (payload.payload.pocketedGuest)
                        setPocketedGuest(payload.payload.pocketedGuest)
                    setIsSimulating(false)
                })
                .on('broadcast', { event: 'game-over' }, (payload: any) => {
                    setWinner(payload.payload.winner)
                    setPhase('finished')
                })
                .subscribe()

            channelRef.current = channel
        },
        [role, playerName]
    )

    const createRoom = useCallback(() => {
        const code = generateRoomCode()
        setRoomCode(code)
        setRole('host')
        setPhase('waiting')
        setupChannel(code)
    }, [setupChannel])

    const joinRoom = useCallback(() => {
        const code = inputCode.trim().toUpperCase()
        if (code.length < 4) {
            setError('Código inválido')
            return
        }
        setRoomCode(code)
        setRole('guest')
        setPhase('waiting')
        setOpponentConnected(true)

        const channel = supabase.channel(`billar-${code}`, {
            config: { broadcast: { self: false } },
        })

        channel
            .on('broadcast', { event: 'game-start' }, (payload: any) => {
                setBalls(payload.payload.balls)
                ballsRef.current = payload.payload.balls
                setTurn(payload.payload.turn)
                setOpponentName(payload.payload.hostName || 'Rival')
                setPhase('playing')
            })
            .on('broadcast', { event: 'shot' }, (payload: any) => {
                const { ballId, vx, vy } = payload.payload
                setBalls((prev) => {
                    const next = prev.map((b) =>
                        b.id === ballId ? { ...b, vx, vy } : b
                    )
                    ballsRef.current = next
                    return next
                })
                setIsSimulating(true)
            })
            .on('broadcast', { event: 'turn-end' }, (payload: any) => {
                setTurn(payload.payload.nextTurn)
                if (payload.payload.balls) {
                    setBalls(payload.payload.balls)
                    ballsRef.current = payload.payload.balls
                }
                if (payload.payload.pocketedHost)
                    setPocketedHost(payload.payload.pocketedHost)
                if (payload.payload.pocketedGuest)
                    setPocketedGuest(payload.payload.pocketedGuest)
                setIsSimulating(false)
            })
            .on('broadcast', { event: 'game-over' }, (payload: any) => {
                setWinner(payload.payload.winner)
                setPhase('finished')
            })
            .subscribe(() => {
                channel.send({
                    type: 'broadcast',
                    event: 'player-join',
                    payload: { name: playerName },
                })
            })

        channelRef.current = channel
    }, [inputCode, playerName])

    // Physics simulation
    useEffect(() => {
        if (phase !== 'playing') return

        let running = true

        const simulate = () => {
            if (!running) return

            let moving = false
            const current = ballsRef.current.map((b) => ({ ...b }))
            const newlyPocketed: Ball[] = []

            for (const ball of current) {
                if (ball.pocketed) continue

                ball.x += ball.vx
                ball.y += ball.vy
                ball.vx *= FRICTION
                ball.vy *= FRICTION

                if (Math.abs(ball.vx) < MIN_VEL && Math.abs(ball.vy) < MIN_VEL) {
                    ball.vx = 0
                    ball.vy = 0
                }

                if (Math.abs(ball.vx) > 0 || Math.abs(ball.vy) > 0) moving = true

                if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx *= -0.8 }
                if (ball.x + ball.r > TABLE_W) { ball.x = TABLE_W - ball.r; ball.vx *= -0.8 }
                if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy *= -0.8 }
                if (ball.y + ball.r > TABLE_H) { ball.y = TABLE_H - ball.r; ball.vy *= -0.8 }

                for (const pocket of POCKETS) {
                    if (dist(ball, pocket) < POCKET_R) {
                        ball.pocketed = true
                        ball.vx = 0
                        ball.vy = 0
                        newlyPocketed.push({ ...ball })
                        break
                    }
                }
            }

            for (let i = 0; i < current.length; i++) {
                if (current[i].pocketed) continue
                for (let j = i + 1; j < current.length; j++) {
                    if (current[j].pocketed) continue
                    const a = current[i]
                    const b = current[j]
                    const dx = b.x - a.x
                    const dy = b.y - a.y
                    const d2 = Math.sqrt(dx * dx + dy * dy)
                    if (d2 < a.r + b.r && d2 > 0) {
                        const nx = dx / d2
                        const ny = dy / d2
                        const overlap = a.r + b.r - d2
                        a.x -= (nx * overlap) / 2
                        a.y -= (ny * overlap) / 2
                        b.x += (nx * overlap) / 2
                        b.y += (ny * overlap) / 2
                        const dvx = a.vx - b.vx
                        const dvy = a.vy - b.vy
                        const dot = dvx * nx + dvy * ny
                        if (dot > 0) {
                            a.vx -= dot * nx * 0.95
                            a.vy -= dot * ny * 0.95
                            b.vx += dot * nx * 0.95
                            b.vy += dot * ny * 0.95
                            moving = true
                        }
                    }
                }
            }

            ballsRef.current = current
            setBalls([...current])

            if (newlyPocketed.length > 0) {
                for (const np of newlyPocketed) {
                    if (np.type === 'cue') continue
                    setPocketedHost((prev) => [...prev, ...newlyPocketed.filter(
                        (bb) => bb.type !== 'cue' && ((bb.type === 'solid' && turn === 'host') || (bb.type === 'stripe' && turn === 'guest'))
                    )])
                    setPocketedGuest((prev) => [...prev, ...newlyPocketed.filter(
                        (bb) => bb.type !== 'cue' && ((bb.type === 'stripe' && turn === 'host') || (bb.type === 'solid' && turn === 'guest'))
                    )])
                    break
                }
            }

            if (!moving && isSimulating) {
                const cueBall = current.find((b) => b.id === 0)
                if (cueBall && cueBall.pocketed) {
                    cueBall.pocketed = false
                    cueBall.x = TABLE_W * 0.25
                    cueBall.y = TABLE_H / 2
                    cueBall.vx = 0
                    cueBall.vy = 0
                    ballsRef.current = [...current]
                    setBalls([...current])
                }

                const remaining = current.filter((b) => !b.pocketed && b.type !== 'cue')
                if (remaining.length === 0) {
                    const hostWins = pocketedHost.length >= pocketedGuest.length
                    const winnerName = hostWins ? 'host' : 'guest'
                    setWinner(winnerName)
                    setPhase('finished')
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'game-over',
                        payload: { winner: winnerName },
                    })
                } else {
                    const nextTurn = turn === 'host' ? 'guest' : 'host'
                    setTurn(nextTurn)
                    setIsSimulating(false)

                    if (role === turn) {
                        channelRef.current?.send({
                            type: 'broadcast',
                            event: 'turn-end',
                            payload: {
                                nextTurn,
                                balls: current,
                                pocketedHost,
                                pocketedGuest,
                            },
                        })
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(simulate)
        }

        animFrameRef.current = requestAnimationFrame(simulate)

        return () => {
            running = false
            cancelAnimationFrame(animFrameRef.current)
        }
    }, [phase, isSimulating, turn, role, pocketedHost, pocketedGuest])

    // Canvas rendering
    useEffect(() => {
        if (phase !== 'playing') return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let raf: number

        const render = () => {
            ctx.clearRect(0, 0, TABLE_W, TABLE_H)

            const grad = ctx.createLinearGradient(0, 0, TABLE_W, TABLE_H)
            grad.addColorStop(0, '#0a5c36')
            grad.addColorStop(1, '#0d7a48')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, TABLE_W, TABLE_H)

            ctx.strokeStyle = 'rgba(139,69,19,0.6)'
            ctx.lineWidth = 3
            ctx.strokeRect(2, 2, TABLE_W - 4, TABLE_H - 4)

            for (const p of POCKETS) {
                ctx.beginPath()
                ctx.arc(p.x, p.y, POCKET_R, 0, Math.PI * 2)
                ctx.fillStyle = '#1a1a2e'
                ctx.fill()
                ctx.strokeStyle = 'rgba(0,0,0,0.4)'
                ctx.lineWidth = 2
                ctx.stroke()
            }

            ctx.setLineDash([5, 5])
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(TABLE_W * 0.35, 20)
            ctx.lineTo(TABLE_W * 0.35, TABLE_H - 20)
            ctx.stroke()
            ctx.setLineDash([])

            for (const ball of ballsRef.current) {
                drawBall(ctx, ball)
            }

            if (aiming && aimStart && aimEnd) {
                const cueBall = ballsRef.current.find((b) => b.id === 0)
                if (cueBall && !cueBall.pocketed) {
                    const dx = aimStart.x - aimEnd.x
                    const dy = aimStart.y - aimEnd.y
                    const power = Math.min(Math.sqrt(dx * dx + dy * dy), 120)

                    ctx.strokeStyle = `rgba(255,255,255,${0.3 + (power / 120) * 0.5})`
                    ctx.lineWidth = 2
                    ctx.setLineDash([6, 4])
                    ctx.beginPath()
                    ctx.moveTo(cueBall.x, cueBall.y)
                    ctx.lineTo(cueBall.x + dx * 2, cueBall.y + dy * 2)
                    ctx.stroke()
                    ctx.setLineDash([])

                    const r = power > 80 ? 244 : 167
                    const g = power > 80 ? 63 : 139
                    const bl = power > 80 ? 94 : 250
                    ctx.fillStyle = `rgba(${r},${g},${bl},0.8)`
                    ctx.fillRect(TABLE_W - 25, TABLE_H - power - 10, 15, power)
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
                    ctx.strokeRect(TABLE_W - 25, TABLE_H - 130, 15, 120)
                }
            }

            raf = requestAnimationFrame(render)
        }

        raf = requestAnimationFrame(render)
        return () => cancelAnimationFrame(raf)
    }, [phase, aiming, aimStart, aimEnd])

    const getCanvasPos = useCallback(
        (e: React.MouseEvent | React.TouchEvent): Vec2 => {
            const canvas = canvasRef.current
            if (!canvas) return { x: 0, y: 0 }
            const rect = canvas.getBoundingClientRect()
            const scaleX = TABLE_W / rect.width
            const scaleY = TABLE_H / rect.height
            let clientX: number, clientY: number
            if ('touches' in e) {
                clientX = e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX
                clientY = e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY
            } else {
                clientX = e.clientX
                clientY = e.clientY
            }
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY,
            }
        },
        []
    )

    const handlePointerDown = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (!isMyTurn) return
            const pos = getCanvasPos(e)
            const cueBall = ballsRef.current.find((b) => b.id === 0)
            if (!cueBall || cueBall.pocketed) return
            if (dist(pos, cueBall) < cueBall.r * 3) {
                setAiming(true)
                setAimStart(pos)
                setAimEnd(pos)
            }
        },
        [isMyTurn, getCanvasPos]
    )

    const handlePointerMove = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (!aiming) return
            e.preventDefault()
            setAimEnd(getCanvasPos(e))
        },
        [aiming, getCanvasPos]
    )

    const handlePointerUp = useCallback(
        () => {
            if (!aiming || !aimStart || !aimEnd) {
                setAiming(false)
                return
            }

            const dx = aimStart.x - aimEnd.x
            const dy = aimStart.y - aimEnd.y
            const power = Math.min(Math.sqrt(dx * dx + dy * dy), 120)

            if (power < 5) {
                setAiming(false)
                return
            }

            const factor = (power / 120) * MAX_POWER
            const len = Math.sqrt(dx * dx + dy * dy)
            const vx = (dx / len) * factor
            const vy = (dy / len) * factor

            setBalls((prev) => {
                const next = prev.map((b) =>
                    b.id === 0 ? { ...b, vx, vy } : b
                )
                ballsRef.current = next
                return next
            })

            setIsSimulating(true)
            setAiming(false)
            setAimStart(null)
            setAimEnd(null)

            channelRef.current?.send({
                type: 'broadcast',
                event: 'shot',
                payload: { ballId: 0, vx, vy },
            })
        },
        [aiming, aimStart, aimEnd]
    )

    const resetToMenu = useCallback(() => {
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
            channelRef.current = null
        }
        setPhase('menu')
        setRole(null)
        setRoomCode('')
        setInputCode('')
        setBalls([])
        setTurn('host')
        setPocketedHost([])
        setPocketedGuest([])
        setWinner(null)
        setOpponentConnected(false)
        setError('')
        setIsSimulating(false)
    }, [])

    useEffect(() => {
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
            }
        }
    }, [])

    return (
        <div className="w-full max-w-3xl mx-auto select-none" ref={containerRef}>
            <AnimatePresence mode="wait">
                {phase === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2
                                className="font-display text-2xl md:text-3xl text-white font-bold"
                                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4), 0 0 30px rgba(16,185,129,0.2)' }}
                            >
                                Billar Online
                            </h2>
                            <p className="text-white/60 text-sm">
                                Crea una sala o unete con código para jugar en tiempo real
                            </p>
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                onClick={createRoom}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Crear Partida
                            </motion.button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-transparent px-4 text-white/40 text-xs uppercase tracking-wider">o</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={(e) => {
                                        setInputCode(e.target.value.toUpperCase())
                                        setError('')
                                    }}
                                    placeholder="Código de sala"
                                    maxLength={6}
                                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-center text-lg tracking-[0.3em] placeholder-white/30 uppercase outline-none focus:border-emerald-400/50 transition-colors font-mono"
                                />
                                <motion.button
                                    onClick={joinRoom}
                                    disabled={inputCode.length < 4}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Unirse
                                </motion.button>
                            </div>

                            {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
                        </div>
                    </motion.div>
                )}

                {phase === 'waiting' && (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6 text-center"
                    >
                        <div className="space-y-3">
                            <div className="w-14 h-14 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                            <h3 className="text-white font-bold text-lg">
                                {role === 'host' ? 'Esperando rival...' : 'Conectando a la sala...'}
                            </h3>
                        </div>

                        {role === 'host' && (
                            <div className="space-y-3">
                                <p className="text-white/60 text-sm">Comparte este código con tu rival:</p>
                                <div className="inline-block px-8 py-4 bg-white/5 border border-white/20 rounded-2xl">
                                    <p className="text-3xl font-mono font-bold text-emerald-300 tracking-[0.5em]">{roomCode}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={resetToMenu}
                            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                        >
                            Cancelar
                        </button>
                    </motion.div>
                )}

                {phase === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between px-2">
                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${turn === 'host'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                    : 'bg-white/5 text-white/40 border border-white/10'
                                }`}>
                                {role === 'host' ? playerName : opponentName}
                                {turn === 'host' && <span className="ml-2 inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                            </div>
                            <div className="text-white/30 text-xs font-bold">VS</div>
                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${turn === 'guest'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                    : 'bg-white/5 text-white/40 border border-white/10'
                                }`}>
                                {role === 'guest' ? playerName : opponentName}
                                {turn === 'guest' && <span className="ml-2 inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className={`text-xs font-bold uppercase tracking-widest ${isMyTurn ? 'text-emerald-300' : 'text-white/40'}`}>
                                {isSimulating ? 'Simulando...' : isMyTurn ? 'Tu turno — arrastra desde la bola blanca' : 'Turno del rival'}
                            </p>
                        </div>

                        <div className="relative w-full overflow-hidden rounded-xl border-4 border-amber-900/60 shadow-2xl shadow-black/50">
                            <canvas
                                ref={canvasRef}
                                width={TABLE_W}
                                height={TABLE_H}
                                className="w-full h-auto cursor-crosshair touch-none"
                                onMouseDown={handlePointerDown}
                                onMouseMove={handlePointerMove}
                                onMouseUp={handlePointerUp}
                                onMouseLeave={() => setAiming(false)}
                                onTouchStart={handlePointerDown}
                                onTouchMove={handlePointerMove}
                                onTouchEnd={handlePointerUp}
                            />
                        </div>

                        <div className="flex justify-between px-2">
                            <div className="flex gap-1 flex-wrap">
                                {pocketedHost.map((b, i) => (
                                    <div key={`h-${b.id}-${i}`} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: b.color }} />
                                ))}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                                {pocketedGuest.map((b, i) => (
                                    <div key={`g-${b.id}-${i}`} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: b.color }} />
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={resetToMenu}
                            className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs"
                        >
                            Abandonar partida
                        </button>
                    </motion.div>
                )}

                {phase === 'finished' && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 text-center"
                    >
                        <div className={`p-8 rounded-2xl border ${winner === role ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-rose-500/10 border-rose-400/30'
                            }`}>
                            <p className={`font-display text-2xl font-bold ${winner === role ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {winner === role ? 'Ganaste!' : 'Perdiste'}
                            </p>
                            <p className="text-white/60 text-sm mt-2">
                                {winner === role ? 'Excelente partida, bien jugado.' : 'Mejor suerte la proxima vez.'}
                            </p>
                        </div>

                        <motion.button
                            onClick={resetToMenu}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Volver al Menu
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
