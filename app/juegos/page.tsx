'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import BackButton from '@/components/BackButton'
import UnlockableHeart from '@/components/UnlockableHeart'
import QuienEsMasGame from '@/components/anniversary/QuienEsMasGame'
import PuzzleDeRecuerdos from '@/components/games/PuzzleDeRecuerdos'
import TapRace from '@/components/games/TapRace'
import HeartDuel from '@/components/games/HeartDuel'

type GameId = 'reto' | 'quien-es-mas' | 'puzzle' | 'tap-race' | 'heart-duel' | null

const GAMES: { id: GameId; title: string; description: string; icon: string }[] = [
	{
		id: 'tap-race',
		title: 'Carrera de Toques',
		description: 'Duelo de velocidad. ¿Quién toca más rápido? Tefa vs Santi.',
		icon: '🏁',
	},
	{
		id: 'heart-duel',
		title: 'Duelo de Besos',
		description: 'Muévanse por la pantalla y demuestren su puntería. Un mini-juego para dos.',
		icon: '⚔',
	},
	{
		id: 'reto',
		title: 'Reto del corazón',
		description: '100 toques en menos de 10 segundos. Si lo cumples, tendrás una recompensa.',
		icon: '❤',
	},
	{
		id: 'quien-es-mas',
		title: '¿Quién es más...?',
		description: 'Voten juntos. Sin prisa. ¿Quién es más divertido? 20 preguntas — Santi vs Tefa.',
		icon: '⚖',
	},
	{
		id: 'puzzle',
		title: 'Puzzle de recuerdos',
		description: 'Armá la imagen. Elegí una y mové las piezas. Al completarla se desbloquea un mensaje.',
		icon: '🧩',
	},
]

export default function JuegosPage() {
	const [selectedGame, setSelectedGame] = useState<GameId>(null)

	return (
		<ConstellationBackground>
			<div className="min-h-screen py-12 px-6 relative z-10">
				<BackButton label="Volver" />

				<div className="max-w-4xl mx-auto">
					{/* Cabecera */}
					<motion.div
						className="flex items-center justify-between gap-4 mb-12 pt-4"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						{selectedGame && (
							<button
								type="button"
								onClick={() => setSelectedGame(null)}
								className="text-white/90 hover:text-white font-medium transition-colors ml-auto"
							>
								← Volver a juegos
							</button>
						)}
					</motion.div>

					<AnimatePresence mode="wait">
						{selectedGame === null ? (
							<motion.div
								key="cards"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<motion.div
									className="text-center mb-14"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
								>
									<h1
										className="font-display text-3xl md:text-5xl text-white font-bold mb-3"
										style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)' }}
									>
										Juegos
									</h1>
									<p className="text-white/80 font-light text-base md:text-lg">
										Pequeñas dinámicas para compartir
									</p>
								</motion.div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
									{GAMES.map((game, i) => (
										<motion.button
											key={game.id}
											type="button"
											onClick={() => game.id && setSelectedGame(game.id)}
											className="text-left rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
											initial={{ opacity: 0, y: 24 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 + i * 0.08 }}
											whileHover={{ scale: 1.02, y: -4 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className="p-6 md:p-8">
												<div
													className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
													style={{
														background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))',
														boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)',
													}}
												>
													{game.icon}
												</div>
												<h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
													{game.title}
												</h2>
												<p className="text-white/75 text-sm md:text-base font-light leading-relaxed">
													{game.description}
												</p>
												<p className="mt-4 text-white/60 text-sm">Entrar al juego →</p>
											</div>
										</motion.button>
									))}
								</div>
							</motion.div>
						) : selectedGame === 'tap-race' ? (
							<motion.div
								key="tap-race"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<TapRace />
							</motion.div>
						) : selectedGame === 'heart-duel' ? (
							<motion.div
								key="heart-duel"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<HeartDuel />
							</motion.div>
						) : selectedGame === 'reto' ? (
							<motion.div
								key="reto"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto"
							>
								<UnlockableHeart />
							</motion.div>
						) : selectedGame === 'quien-es-mas' ? (
							<motion.div
								key="quien-es-mas"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<QuienEsMasGame />
							</motion.div>
						) : (
							<motion.div
								key="puzzle"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<PuzzleDeRecuerdos />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</ConstellationBackground>
	)
}
