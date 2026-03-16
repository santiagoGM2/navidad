'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import BackButton from '@/components/BackButton'
import QuienEsMasGame from '@/components/anniversary/QuienEsMasGame'
import PuzzleDeRecuerdos from '@/components/games/PuzzleDeRecuerdos'
import AhorcadoGame from '@/components/games/AhorcadoGame'
import UnlockableHeart from '@/components/UnlockableHeart'
import WordleGame from '@/components/games/WordleGame'
import TrikiGame from '@/components/games/TrikiGame'

type GameId = 'reto' | 'quien-es-mas' | 'puzzle' | 'ahorcado' | 'wordle' | 'triki' | null

const GAMES: { id: GameId; title: string; description: string; icon: React.ReactNode; gradient: string }[] = [
	{
		id: 'reto',
		title: 'Reto del Corazon',
		description: 'Cumple el reto de velocidad para desbloquear una recompensa especial.',
		gradient: 'from-pink-500/20 to-rose-500/20',
		icon: (
			<svg className="w-8 h-8 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</svg>
		),
	},
	{
		id: 'quien-es-mas',
		title: 'Quien es mas...?',
		description: 'Voten juntos en esta dinámica de pareja. Quien encaja mejor con cada frase?',
		gradient: 'from-blue-500/20 to-cyan-500/20',
		icon: (
			<svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
			</svg>
		),
	},
	{
		id: 'puzzle',
		title: 'Puzzle de Recuerdos',
		description: 'Rearma nuestras fotos favoritas. Cada pieza cuenta una parte de nosotros.',
		gradient: 'from-purple-500/20 to-violet-500/20',
		icon: (
			<svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
			</svg>
		),
	},
	{
		id: 'ahorcado',
		title: 'Ahorcado',
		description: 'Un jugador escribe la palabra secreta y el otro la adivina. Turnos en el mismo celular.',
		gradient: 'from-amber-500/20 to-orange-500/20',
		icon: (
			<svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
			</svg>
		),
	},
	{
		id: 'wordle',
		title: 'Palabras',
		description: 'Adivina la palabra del día relacionada con nosotros. Tienes 6 intentos.',
		gradient: 'from-emerald-500/20 to-teal-500/20',
		icon: (
			<svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
			</svg>
		),
	},
	{
		id: 'triki',
		title: 'Triqui',
		description: 'El clásico tres en línea para que compitamos un ratito juntos.',
		gradient: 'from-indigo-500/20 to-blue-500/20',
		icon: (
			<svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20V4m6 16V4" />
			</svg>
		),
	},
]

export default function JuegosPage() {
	const [selectedGame, setSelectedGame] = useState<GameId>(null)

	return (
		<ConstellationBackground>
			<div className="min-h-screen py-12 px-6 relative z-10">
				{selectedGame !== 'wordle' && <BackButton label="Volver" />}

				<div className="max-w-4xl mx-auto">
					{selectedGame !== 'wordle' && (
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
					)}

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
										Zona de Juegos
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
													className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${game.gradient}`}
													style={{
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
						) : selectedGame === 'puzzle' ? (
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
						) : selectedGame === 'ahorcado' ? (
							<motion.div
								key="ahorcado"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<AhorcadoGame />
							</motion.div>
						) : selectedGame === 'wordle' ? (
							<motion.div
								key="wordle"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<WordleGame />
							</motion.div>
						) : selectedGame === 'triki' ? (
							<motion.div
								key="triki"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/15 p-6 md:p-10"
							>
								<TrikiGame />
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
			</div>
		</ConstellationBackground>
	)
}
