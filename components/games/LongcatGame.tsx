'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

// Niveles básicos estilo "llenar el tablero". 0 = vacío, 1 = pared, 2 = inicio
const LEVELS = [
	{
		grid: [
			[1, 1, 1, 1, 1],
			[1, 2, 0, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 1, 1, 1]
		],
		totalEmpty: 6
	},
	{
		grid: [
			[1, 1, 1, 1, 1, 1],
			[1, 2, 0, 0, 0, 1],
			[1, 0, 1, 1, 0, 1],
			[1, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1]
		],
		totalEmpty: 8
	},
	{
		grid: [
			[1, 1, 1, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 2, 0, 0, 1],
			[1, 1, 1, 1, 1]
		],
		totalEmpty: 9
	}
]

type Position = { r: number, c: number }

export default function LongcatGame() {
	const [levelIndex, setLevelIndex] = useState(0)
	const [path, setPath] = useState<Position[]>([])
	const [status, setStatus] = useState<'playing' | 'won' | 'finished'>('playing')

	const level = LEVELS[levelIndex]

	const loadLevel = useCallback((idx: number) => {
		if (idx >= LEVELS.length) {
			setStatus('finished')
			return
		}
		const lvl = LEVELS[idx]
		let start = { r: 0, c: 0 }
		for (let r = 0; r < lvl.grid.length; r++) {
			for (let c = 0; c < lvl.grid[r].length; c++) {
				if (lvl.grid[r][c] === 2) {
					start = { r, c }
				}
			}
		}
		setPath([start])
		setStatus('playing')
	}, [])

	useEffect(() => {
		loadLevel(levelIndex)
	}, [levelIndex, loadLevel])

	const handleKeyDown = useCallback((e: globalThis.KeyboardEvent) => {
		if (status !== 'playing') return

		const head = path[path.length - 1]
		let next = { ...head }

		if (e.key === 'ArrowUp' || e.key === 'w') next.r--
		else if (e.key === 'ArrowDown' || e.key === 's') next.r++
		else if (e.key === 'ArrowLeft' || e.key === 'a') next.c--
		else if (e.key === 'ArrowRight' || e.key === 'd') next.c++
		else return

		// Retroceso (Undo un paso)
		if (path.length > 1) {
			const prev = path[path.length - 2]
			if (prev.r === next.r && prev.c === next.c) {
				setPath(path.slice(0, -1))
				triggerVibration(20)
				return
			}
		}

		// Checar paredes y cuerpo
		if (
			next.r < 0 || next.r >= level.grid.length ||
			next.c < 0 || next.c >= level.grid[0].length ||
			level.grid[next.r][next.c] === 1 ||
			path.some(p => p.r === next.r && p.c === next.c)
		) {
			return // Colisión
		}

		// Moverse
		const newPath = [...path, next]
		setPath(newPath)
		triggerVibration(10)

		// Checar victoria
		if (newPath.length - 1 === level.totalEmpty) {
			setStatus('won')
			triggerVibration([50, 50, 100])
		}
	}, [status, path, level])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	// Swipe detection for mobile
	const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)

	const onTouchStart = (e: React.TouchEvent) => {
		setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
	}

	const onTouchMove = (e: React.TouchEvent) => {
		if (!touchStart || status !== 'playing') return

		const touchEndX = e.touches[0].clientX
		const touchEndY = e.touches[0].clientY
		const dx = touchEndX - touchStart.x
		const dy = touchEndY - touchStart.y

		if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
			const event = new KeyboardEvent('keydown', {
				key: Math.abs(dx) > Math.abs(dy)
					? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
					: (dy > 0 ? 'ArrowDown' : 'ArrowUp')
			})
			handleKeyDown(event)
			setTouchStart({ x: touchEndX, y: touchEndY })
		}
	}

	if (status === 'finished') {
		return (
			<div className="text-center py-20 px-6">
				<h2 className="text-4xl font-bold text-emerald-400 mb-4">¡Completaste todo!</h2>
				<p className="text-white/70 mb-8">Eres un maestro del Longcat (o Longdog en nuestro caso).</p>
				<button onClick={() => setLevelIndex(0)} className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
					Volver a jugar
				</button>
			</div>
		)
	}

	if (!level) return null

	return (
		<div className="w-full max-w-sm mx-auto select-none space-y-6" onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
			<div className="text-center">
				<h2 className="font-display text-3xl font-bold text-white tracking-widest" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
					LONG CAT
				</h2>
				<p className="text-white/60 text-sm mt-2">Nivel {levelIndex + 1}</p>
				<p className="text-amber-400/80 text-xs mt-1">Llena todos los espacios. Desliza o usa flechas.</p>
			</div>

			<div className="relative mx-auto bg-black/40 border-4 border-indigo-900/50 rounded-xl p-2 w-fit overflow-hidden">
				<div
					className="grid gap-1"
					style={{
						gridTemplateColumns: `repeat(${level.grid[0].length}, 40px)`,
						gridTemplateRows: `repeat(${level.grid.length}, 40px)`
					}}
				>
					{level.grid.map((row, r) => (
						row.map((cell, c) => {
							const isWall = cell === 1
							const pathIndex = path.findIndex(p => p.r === r && p.c === c)
							const isBody = pathIndex !== -1
							const isHead = pathIndex === path.length - 1

							return (
								<div
									key={`${r}-${c}`}
									className={`w-[40px] h-[40px] rounded-md transition-all ${
										isWall ? 'bg-indigo-950 border border-indigo-900' : 'bg-white/5 border border-white/5'
									}`}
								>
									{isBody && (
										<motion.div
											initial={{ scale: 0.5, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											className={`w-full h-full rounded-md flex items-center justify-center ${
												isHead ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] z-10' : 'bg-amber-500/80 z-0'
											}`}
										>
											{isHead && <span className="text-black text-xs font-bold">😺</span>}
										</motion.div>
									)}
								</div>
							)
						})
					))}
				</div>

				{status === 'won' && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"
					>
						<p className="text-emerald-400 font-bold text-2xl mb-4">¡Nivel Superado!</p>
						<button
							onClick={() => setLevelIndex(levelIndex + 1)}
							className="px-6 py-2 bg-emerald-500 text-white rounded-xl shadow-lg font-bold"
						>
							Siguiente Nivel
						</button>
					</motion.div>
				)}
			</div>
			
			<div className="flex justify-between items-center px-4">
				<button 
					onClick={() => loadLevel(levelIndex)} 
					className="text-white/40 hover:text-white/80 transition-colors text-sm underline"
				>
					Reiniciar Nivel
				</button>
			</div>
		</div>
	)
}
