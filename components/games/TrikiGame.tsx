'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

type Player = 'X' | 'O' | null

const winningCombos = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
	[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
	[0, 4, 8], [2, 4, 6]             // Diagonales
]

export default function TrikiGame() {
	const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
	const [xIsNext, setXIsNext] = useState(true)
	const [winner, setWinner] = useState<Player>(null)
	const [winningLine, setWinningLine] = useState<number[]>([])

	const handleClick = (index: number) => {
		if (board[index] || winner) return

		const newBoard = [...board]
		newBoard[index] = xIsNext ? 'X' : 'O'
		setBoard(newBoard)
		setXIsNext(!xIsNext)

		triggerVibration(xIsNext ? 30 : 50)

		const checkWinner = (squares: Player[]) => {
			for (let i = 0; i < winningCombos.length; i++) {
				const [a, b, c] = winningCombos[i]
				if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
					return { player: squares[a], line: [a, b, c] }
				}
			}
			return null
		}

		const win = checkWinner(newBoard)
		if (win) {
			setWinner(win.player)
			setWinningLine(win.line)
			triggerVibration([100, 50, 100])
		}
	}

	const resetGame = () => {
		setBoard(Array(9).fill(null))
		setXIsNext(true)
		setWinner(null)
		setWinningLine([])
	}

	const isDraw = !winner && board.every(square => square !== null)

	return (
		<div className="w-full max-w-sm mx-auto select-none space-y-8">
			<div className="text-center space-y-2">
				<h2 className="font-display text-4xl text-white font-bold tracking-wider" style={{ textShadow: '0 2px 15px rgba(139,92,246,0.5)' }}>
					Triqui
				</h2>
				<p className="text-white/60 text-sm">El clásico, juega con tu persona favorita.</p>
			</div>

			<div className="flex justify-between items-center mb-4 px-4">
				<div className={`px-4 py-2 rounded-xl transition-all ${xIsNext && !winner ? 'bg-violet-500/20 text-violet-300 border border-violet-400/50 shadow-lg' : 'text-white/40'}`}>
					<span className="font-bold text-xl">X</span>
				</div>
				<div className="text-white/30 text-xs tracking-widest uppercase">
					{winner ? 'Ganador' : isDraw ? 'Empate' : 'Turno'}
				</div>
				<div className={`px-4 py-2 rounded-xl transition-all ${!xIsNext && !winner ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-lg' : 'text-white/40'}`}>
					<span className="font-bold text-xl">O</span>
				</div>
			</div>

			<div className="relative aspect-square max-w-[300px] mx-auto bg-white/5 rounded-2xl p-3 border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
				<div className="grid grid-cols-3 gap-2 h-full w-full">
					{board.map((cell, idx) => {
						const isWinningCell = winningLine.includes(idx)
						return (
							<button
								key={idx}
								onClick={() => handleClick(idx)}
								className={`
									relative rounded-xl font-display text-5xl flex items-center justify-center transition-all duration-300 font-bold
									${!cell && !winner ? 'bg-white/5 hover:bg-white/10 active:scale-95 cursor-pointer' : 'bg-white/10 cursor-default'}
									${isWinningCell ? (cell === 'X' ? 'bg-violet-500/30' : 'bg-emerald-500/30') : ''}
									${cell === 'X' ? 'text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]' : cell === 'O' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'text-transparent'}
								`}
							>
								{cell && (
									<motion.span
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ type: 'spring', stiffness: 300, damping: 20 }}
									>
										{cell}
									</motion.span>
								)}
							</button>
						)
					})}
				</div>

				{/* Lucha entre ganadores y perdedores */}
				<AnimatePresence>
					{(winner || isDraw) && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm rounded-2xl"
						>
							<div className="bg-slate-900 border border-white/20 p-6 rounded-2xl shadow-2xl text-center space-y-4">
								<p className="text-2xl font-bold text-white">
									{winner ? `¡Ganaron las ${winner}!` : '¡Es un empate!'}
								</p>
								<button
									onClick={resetGame}
									className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium tracking-wide shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105 active:scale-95"
								>
									Jugar de nuevo
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}
