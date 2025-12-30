'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { LETTERS } from '@/constants'
import ConstellationBackground from '@/components/ConstellationBackground'

export default function CartasPage() {
	const [selectedLetter, setSelectedLetter] = useState<number | null>(null)

	const handleSelectLetter = (index: number) => {
		setSelectedLetter(index)
	}

	const handleBack = () => {
		setSelectedLetter(null)
	}

	return (
		<ConstellationBackground>
			<main className="min-h-screen py-20 px-4 relative z-10">
				{/* Botón volver al inicio */}
				<motion.div
					className="fixed top-6 left-6 z-50"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Link href="/">
						<motion.button
							className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							<span className="text-sm font-medium">Volver</span>
						</motion.button>
					</Link>
				</motion.div>

				<div className="max-w-4xl mx-auto pt-12">
					<AnimatePresence mode="wait">
						{selectedLetter === null ? (
							// Vista de selección - 3 Cartas
							<motion.div
								key="selection"
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -30 }}
								className="space-y-8"
							>
								<motion.div
									className="text-center mb-12"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
										Mis Cartas para Ti
									</h1>
									<p className="text-white/60 text-lg font-light">
										Palabras escritas desde lo más profundo de mi corazón
									</p>
								</motion.div>

								<div className="grid gap-6 md:grid-cols-1">
									{LETTERS.map((letter, index) => (
										<motion.button
											key={letter.id}
											whileHover={{ scale: 1.02, y: -5 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => handleSelectLetter(index)}
											className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-left hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.15 }}
										>
											<div className="flex items-center gap-5">
												{/* Icono de sobre animado */}
												<motion.div
													className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg group-hover:shadow-rose-500/30"
													whileHover={{ rotate: [0, -10, 10, 0] }}
													transition={{ duration: 0.5 }}
												>
													<svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
														<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
													</svg>
												</motion.div>

												<div className="flex-1">
													<h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1 group-hover:text-rose-200 transition-colors">
														{letter.title}
													</h3>
													{letter.date && (
														<p className="text-white/50 text-sm">
															{new Date(letter.date).toLocaleDateString('es-ES', {
																day: 'numeric',
																month: 'long',
																year: 'numeric',
															})}
														</p>
													)}
												</div>

												{/* Flecha */}
												<svg className="w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</div>
										</motion.button>
									))}
								</div>
							</motion.div>
						) : (
							// Vista de carta abierta
							<motion.div
								key="open"
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: -20 }}
								transition={{ duration: 0.5 }}
							>
								{/* Carta estilo papel */}
								<motion.div
									className="relative backdrop-blur-xl bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 md:p-12 shadow-2xl border border-amber-100"
									animate={{
										y: [0, -5, 0],
									}}
									transition={{
										duration: 6,
										repeat: Infinity,
										ease: 'easeInOut'
									}}
								>
									{/* Botón volver */}
									<button
										onClick={handleBack}
										className="mb-8 text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-2 group"
									>
										<svg
											className="w-5 h-5 transition-transform group-hover:-translate-x-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
										</svg>
										Volver a mis cartas
									</button>

									{/* Decoración de esquina */}
									<div className="absolute top-4 right-4 w-16 h-16 opacity-20">
										<svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
											<path
												d="M50,10 C60,10 70,15 75,25 C80,35 80,45 75,55 C70,65 60,75 50,85 C40,75 30,65 25,55 C20,45 20,35 25,25 C30,15 40,10 50,10"
												fill="currentColor"
											/>
										</svg>
									</div>

									{/* Título */}
									<motion.h2
										className="font-display text-3xl md:text-4xl font-bold text-amber-900 mb-4"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
									>
										{LETTERS[selectedLetter].title}
									</motion.h2>

									{/* Fecha */}
									{LETTERS[selectedLetter].date && (
										<motion.p
											className="text-amber-600/70 text-sm mb-8 flex items-center gap-2"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.3 }}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											{new Date(LETTERS[selectedLetter].date!).toLocaleDateString('es-ES', {
												day: 'numeric',
												month: 'long',
												year: 'numeric',
											})}
										</motion.p>
									)}

									{/* Contenido */}
									<motion.div
										className="prose prose-lg max-w-none"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.4 }}
									>
										<p className="text-amber-800 leading-loose whitespace-pre-line text-lg md:text-xl font-serif">
											{LETTERS[selectedLetter].content}
										</p>
									</motion.div>

									{/* Corazón al final */}
									<motion.div
										className="mt-12 flex justify-center"
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
									>
										<motion.div
											animate={{
												scale: [1, 1.1, 1],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
												ease: 'easeInOut'
											}}
											className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg"
										>
											<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
											</svg>
										</motion.div>
									</motion.div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</main>
		</ConstellationBackground>
	)
}
