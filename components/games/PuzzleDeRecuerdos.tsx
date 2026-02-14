'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

const GRID = 3
const TOTAL = GRID * GRID

const PUZZLE_IMAGES = [
	'/images/noviazgo.jpg',
	'/images/IMG_0749.jpg',
	'/images/IMG_3183.jpg',
	'/images/IMG_5917.jpg',
	'/images/IMG_6587.jpg',
	'/images/IMG_1555.jpg',
]

const SECRET_MESSAGE = 'Cada pieza que armamos juntos es un recuerdo que nos une. Te amo.'

function shuffleOrder(): number[] {
	const arr = Array.from({ length: TOTAL }, (_, i) => i)
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

export default function PuzzleDeRecuerdos() {
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [order, setOrder] = useState<number[]>(Array.from({ length: TOTAL }, (_, i) => i))
	const [completed, setCompleted] = useState(false)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		setOrder(shuffleOrder())
		setReady(true)
	}, [])

	const IMAGE_SRC = PUZZLE_IMAGES[currentImageIndex] || PUZZLE_IMAGES[0]

	const resetPuzzle = useCallback(() => {
		setCompleted(false)
		setOrder(shuffleOrder())
	}, [])

	const checkComplete = useCallback((newOrder: number[]) => {
		const ok = newOrder.every((v, i) => v === i)
		if (ok) {
			setCompleted(true)
			triggerVibration([100, 50, 100])
		}
	}, [])

	const move = (index: number) => {
		const emptyIndex = order.indexOf(0)
		const cols = GRID
		const row = Math.floor(index / cols)
		const col = index % cols
		const emptyRow = Math.floor(emptyIndex / cols)
		const emptyCol = emptyIndex % cols
		const isAdjacent =
			(Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
			(Math.abs(col - emptyCol) === 1 && row === emptyRow)
		if (!isAdjacent) return
		const newOrder = [...order]
		newOrder[emptyIndex] = order[index]
		newOrder[index] = 0
		setOrder(newOrder)
		checkComplete(newOrder)
	}

	return (
		<div className="space-y-6">
			<h2 className="font-display text-2xl text-white text-center" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
				Puzzle de recuerdos
			</h2>
			<p className="text-white/70 text-center text-sm">
				Elegí una imagen y ordená las piezas. Tocá la que está al lado del hueco para moverla.
			</p>

			{PUZZLE_IMAGES.length > 1 && (
				<div className="flex flex-wrap justify-center gap-2">
					{PUZZLE_IMAGES.map((src, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => {
								if (idx !== currentImageIndex && !completed) {
									setCurrentImageIndex(idx)
									setOrder(shuffleOrder())
								}
							}}
							className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
								currentImageIndex === idx ? 'border-cyan-400 opacity-100' : 'border-white/30 opacity-70 hover:opacity-100'
							}`}
							style={{
								backgroundImage: `url(${src})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						/>
					))}
				</div>
			)}

			<AnimatePresence mode="wait">
				{completed ? (
					<motion.div
						key="done"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						className="text-center space-y-6"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: [0, 1.2, 1] }}
							transition={{ duration: 0.6, times: [0, 0.6, 1] }}
							className="text-6xl"
						>
							🎉
						</motion.div>
						<div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30">
							<p className="text-emerald-300 font-bold text-lg mb-3">¡Completado!</p>
							<p className="text-white font-display text-lg leading-relaxed max-w-md mx-auto">
								{SECRET_MESSAGE}
							</p>
						</div>
						<button
							type="button"
							onClick={resetPuzzle}
							className="px-6 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
						>
							Armar otro
						</button>
					</motion.div>
				) : ready ? (
					<motion.div
						key="puzzle"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="grid gap-1 max-w-sm mx-auto"
						style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
					>
						{order.map((piece, index) => {
							if (piece === 0) {
								return <div key="empty" className="aspect-square bg-white/10 rounded-lg" />
							}
							const row = Math.floor(piece / GRID)
							const col = piece % GRID
							return (
								<motion.button
									key={piece}
									type="button"
									onClick={() => move(index)}
									className="aspect-square relative rounded-lg overflow-hidden border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 bg-white/5"
									whileTap={{ scale: 0.98 }}
									style={{
										backgroundImage: `url(${IMAGE_SRC})`,
										backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
										backgroundPosition: `${-col * 100}% ${-row * 100}%`,
									}}
								/>
							)
						})}
					</motion.div>
				) : (
					<div className="h-64 flex items-center justify-center text-white/60">Cargando…</div>
				)}
			</AnimatePresence>
		</div>
	)
}
