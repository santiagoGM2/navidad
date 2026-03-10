'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

const GRID = 3
const TOTAL = GRID * GRID

type GameMode = 'sliding' | 'place'

const PUZZLE_IMAGES = [
	'/images/noviazgo.jpg',
	'/images/IMG_0749.jpg',
	'/images/IMG_3183.jpg',
	'/images/IMG_5917.jpg',
	'/images/IMG_6587.jpg',
	'/images/IMG_1555.jpg',
	'/images/IMG_9395.jpg',
	'/images/IMG_5306.jpg',
	'/images/IMG_4533.jpg',
	'/images/IMG_3464.jpg',
	'/images/IMG_2882.jpg',
]

const SECRET_MESSAGE = 'Cada pieza que armamos juntos es un recuerdo que nos une. Te amo.'

function shuffleOrder(isSliding: boolean): number[] {
	const arr = Array.from({ length: TOTAL }, (_, i) => i)
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

export default function PuzzleDeRecuerdos() {
	const [mode, setMode] = useState<GameMode>('sliding')
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	
	// 'order' represents the grid:
	// For sliding: order[index] = pieceId (0 = empty space)
	// For place: order[index] = pieceId, or -1 if empty.
	const [order, setOrder] = useState<number[]>([])
	
	// Only for 'place' mode: pieces still to be placed. pieceId (0 to TOTAL-1)
	const [bankPieces, setBankPieces] = useState<number[]>([])
	const [selectedBankPiece, setSelectedBankPiece] = useState<number | null>(null)

	const [completed, setCompleted] = useState(false)
	const [ready, setReady] = useState(false)

	const initGame = useCallback((m: GameMode) => {
		let newOrder = shuffleOrder(m === 'sliding')
		if (m === 'sliding') {
			setOrder(newOrder)
			setBankPieces([])
		} else {
			// For placing: empty grid (-1 everywhere), and pieces are in the bank.
			setOrder(Array.from({ length: TOTAL }, () => -1))
			setBankPieces(newOrder)
		}
		setSelectedBankPiece(null)
		setCompleted(false)
		setReady(true)
	}, [])

	useEffect(() => {
		initGame(mode)
	}, [mode, initGame])

	const IMAGE_SRC = PUZZLE_IMAGES[currentImageIndex] || PUZZLE_IMAGES[0]

	const resetPuzzle = useCallback(() => {
		initGame(mode)
	}, [mode, initGame])

	const checkComplete = useCallback((newOrder: number[], currentMode: GameMode) => {
		if (currentMode === 'sliding') {
			const ok = newOrder.every((v, i) => v === i)
			if (ok) {
				setCompleted(true)
				triggerVibration([100, 50, 100])
			}
		} else {
			const ok = newOrder.every((v, i) => v === i)
			if (ok) {
				setCompleted(true)
				triggerVibration([100, 50, 100])
			}
		}
	}, [])

	const moveSliding = (index: number) => {
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
		checkComplete(newOrder, 'sliding')
	}

	const handleGridClickPlace = (index: number) => {
		if (selectedBankPiece === null) {
			// Check if we can return a piece to the bank
			if (order[index] !== -1) {
				const pieceId = order[index]
				const newOrder = [...order]
				newOrder[index] = -1
				setOrder(newOrder)
				setBankPieces([...bankPieces, pieceId])
			}
			return
		}

		// Place a piece from bank
		const newOrder = [...order]
		let newBankPieces = [...bankPieces]
		
		if (newOrder[index] !== -1) {
			// Swap with what's already there
			const existingPiece = newOrder[index]
			newOrder[index] = selectedBankPiece
			newBankPieces = newBankPieces.filter(p => p !== selectedBankPiece)
			newBankPieces.push(existingPiece)
		} else {
			// Just place it
			newOrder[index] = selectedBankPiece
			newBankPieces = newBankPieces.filter(p => p !== selectedBankPiece)
		}
		
		setOrder(newOrder)
		setBankPieces(newBankPieces)
		setSelectedBankPiece(null)
		checkComplete(newOrder, 'place')
	}

	const renderPieceContent = (piece: number) => {
		const row = Math.floor(piece / GRID)
		const col = piece % GRID
		return (
			<div
				className="w-full h-full"
				style={{
					backgroundImage: `url(${IMAGE_SRC})`,
					backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
					backgroundPosition: `${-col * 100}% ${-row * 100}%`,
				}}
			/>
		)
	}

	return (
		<div className="space-y-6 select-none">
			<h2 className="font-display text-2xl text-white text-center" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
				Puzzle de recuerdos
			</h2>
			
			<div className="flex justify-center gap-4">
				<button
					onClick={() => { if (!completed) setMode('sliding') }}
					className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${mode === 'sliding' ? 'bg-violet-600 text-white shadow-lg' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
				>
					Modo Deslizar
				</button>
				<button
					onClick={() => { if (!completed) setMode('place') }}
					className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${mode === 'place' ? 'bg-violet-600 text-white shadow-lg' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
				>
					Modo Armar
				</button>
			</div>

			<p className="text-white/70 text-center text-sm px-4">
				{mode === 'sliding' 
					? 'Elegí una imagen y ordená las piezas. Tocá la que está al lado del hueco para moverla.' 
					: 'Selecciona una pieza y toca un espacio vacío para colocarla.'}
			</p>

			{PUZZLE_IMAGES.length > 1 && (
				<div className="flex flex-wrap justify-center gap-2 max-h-24 overflow-y-auto px-2">
					{PUZZLE_IMAGES.map((src, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => {
								if (idx !== currentImageIndex && !completed) {
									setCurrentImageIndex(idx)
									initGame(mode)
								}
							}}
							className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
								currentImageIndex === idx ? 'border-cyan-400 opacity-100 shadow-md scale-105' : 'border-white/30 opacity-70 hover:opacity-100 hover:scale-105'
							} transition-all`}
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
						className="text-center space-y-6 mt-4"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: [0, 1.2, 1] }}
							transition={{ duration: 0.6, times: [0, 0.6, 1] }}
							className="flex justify-center"
						>
							<div className="w-16 h-16 text-emerald-400">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							</div>
						</motion.div>
						<div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30">
							<p className="text-emerald-300 font-bold text-lg mb-3">¡Armamos este recuerdo!</p>
							<p className="text-white font-display text-lg leading-relaxed max-w-md mx-auto">
								{SECRET_MESSAGE}
							</p>
						</div>
						<div className="flex justify-center gap-4">
							<button
								type="button"
								onClick={resetPuzzle}
								className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
							>
								Armar de nuevo
							</button>
						</div>
					</motion.div>
				) : ready ? (
					<motion.div
						key={`puzzle-${mode}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-6"
					>
						<div 
							className="grid gap-1 max-w-xs mx-auto p-2 bg-white/5 rounded-xl border border-white/10"
							style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
						>
							{order.map((piece, index) => {
								if (mode === 'sliding') {
									if (piece === 0) {
										return <div key="empty" className="aspect-square bg-white/5 rounded-lg" />
									}
									const row = Math.floor(piece / GRID)
									const col = piece % GRID
									return (
										<motion.button
											key={piece}
											type="button"
											onClick={() => moveSliding(index)}
											className="aspect-square relative rounded-lg overflow-hidden border border-white/20 focus:outline-none bg-white/5"
											whileTap={{ scale: 0.95 }}
											style={{
												backgroundImage: `url(${IMAGE_SRC})`,
												backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
												backgroundPosition: `${-col * 100}% ${-row * 100}%`,
											}}
										/>
									)
								} else {
									// Place mode
									if (piece === -1) {
										return (
											<motion.button
												key={`empty-${index}`}
												type="button"
												className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-lg focus:outline-none active:bg-white/10 transition-colors"
												onClick={() => handleGridClickPlace(index)}
												whileHover={selectedBankPiece !== null ? { scale: 0.95, backgroundColor: 'rgba(139, 92, 246, 0.2)' } : {}}
											/>
										)
									} else {
										return (
											<motion.button
												key={`piece-${piece}`}
												className="aspect-square relative rounded-lg overflow-hidden border border-white/20 focus:outline-none"
												onClick={() => handleGridClickPlace(index)}
												whileHover={{ scale: 0.95 }}
											>
												{renderPieceContent(piece)}
											</motion.button>
										)
									}
								}
							})}
						</div>

						{/* Bank for placing mode */}
						{mode === 'place' && bankPieces.length > 0 && (
							<motion.div 
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-6"
							>
								<p className="text-xs text-white/50 text-center uppercase tracking-widest mb-3">Piezas Faltantes</p>
								<div className="flex flex-wrap justify-center gap-2 px-2 pb-4">
									{bankPieces.map(piece => (
										<motion.button
											key={`bank-${piece}`}
											onClick={() => setSelectedBankPiece(selectedBankPiece === piece ? null : piece)}
											className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
												selectedBankPiece === piece ? 'border-violet-500 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10 relative' : 'border-white/20 opacity-80 hover:opacity-100 hover:scale-105'
											}`}
										>
											{renderPieceContent(piece)}
										</motion.button>
									))}
								</div>
							</motion.div>
						)}
					</motion.div>
				) : (
					<div className="h-64 flex items-center justify-center text-white/60">Cargando…</div>
				)}
			</AnimatePresence>
		</div>
	)
}
