'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import BackButton from '@/components/BackButton'
import Image from 'next/image'

export default function CumpleaneraPage() {
	const [pin, setPin] = useState('')
	const [isAuthorized, setIsAuthorized] = useState(false)
	const [error, setError] = useState(false)

	const handleVerify = (e: React.FormEvent) => {
		e.preventDefault()
		if (pin === '3186') {
			setIsAuthorized(true)
			setError(false)
		} else {
			setError(true)
			setPin('')
			setTimeout(() => setError(false), 2000)
		}
	}

	if (!isAuthorized) {
		return (
			<ConstellationBackground>
				<BackButton label="Volver" />
				<div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 w-full">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 text-center shadow-2xl"
					>
						<div className="w-20 h-20 mx-auto bg-gradient-to-tr from-violet-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-8 rotate-3">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>

						<h1 className="font-display text-3xl font-bold text-white mb-3">Acceso Protegido</h1>
						<p className="text-white/60 text-sm mb-8">Ingresa el código para ver esta sección especial.</p>

						<form onSubmit={handleVerify} className="space-y-4">
							<div className="relative">
								<input
									type="password"
									value={pin}
									onChange={(e) => setPin(e.target.value)}
									placeholder="••••"
									className={`w-full bg-white/5 border ${error ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl px-6 py-4 text-center text-2xl tracking-[0.5em] text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all font-mono`}
									maxLength={4}
									autoFocus
								/>
								<AnimatePresence>
									{error && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0 }}
											className="text-rose-400 text-xs font-bold mt-3 uppercase tracking-widest"
										>
											Código incorrecto.
										</motion.p>
									)}
								</AnimatePresence>
							</div>

							<button
								type="submit"
								className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all active:scale-95"
							>
								VER SORPRESA
							</button>
						</form>
					</motion.div>
				</div>
			</ConstellationBackground>
		)
	}

	return (
		<ConstellationBackground>
			<BackButton label="Volver" />
			
			<div className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8 w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					className="text-center mb-16"
				>
					<h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400 mb-6 drop-shadow-[0_0_25px_rgba(244,114,182,0.4)]">
						Para mi cumpleañera
						<br/>
						<span className="text-white text-3xl sm:text-5xl font-normal">cachetona hermosa</span>
					</h1>
					<p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto italic">
						&quot;Un día en el que el mundo se hizo más bonito porque tú llegaste a él&quot;
					</p>
				</motion.div>

				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 100 }}
					className="w-full relative group"
				>
					{/* Glow de fondo para darle espectacularidad */}
					<div className="absolute inset-[-10%] bg-gradient-to-t from-pink-500/30 via-violet-500/20 to-transparent blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
					
					{/* Portrait Effect Container */}
					<div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[533px] mx-auto rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_80px_rgba(244,114,182,0.4)] transition-all duration-700">
						
						{/* Imagen Base */}
						<Image
							src="/images/portrait-couple.jpg"
							alt="Portrait de los dos"
							fill
							className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 brightness-90 saturate-110"
							priority
						/>
						
						{/* Overlay Gradiente de abajo */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent mix-blend-multiply" />
						
						{/* Portrait Effect Filters & Overlays */}
						<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczJyBoZWlnaHQ9JzMnPjxyZWN0IHdpZHRoPSczJyBoZWlnaHQ9JzMnIGZpbGw9J2JsYWNrJyBmaWxsLW9wYWNpdHk9JzAuMScvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay mix-blend-soft-light" />
						
						{/* Marcos de "Coding" o Efecto Visual Premium */}
						<div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/40 group-hover:border-white transition-colors duration-500" />
						<div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/40 group-hover:border-white transition-colors duration-500" />
						
						{/* Texto principal encima */}
						<div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col items-center justify-end h-1/2 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
							<motion.h2 
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.8, duration: 0.8 }}
								className="font-display text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide text-center uppercase"
								style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(244,114,182,0.6)' }}
							>
								Te amo cachetona
							</motion.h2>
							<motion.p
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ delay: 1.2, duration: 1 }}
								className="text-white/80 font-mono text-sm tracking-[0.2em] text-center"
							>
								FELIZ CUMPLEAÑOS
							</motion.p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 2, duration: 1 }}
					className="mt-20 max-w-2xl text-center space-y-6"
				>
					<p className="text-white/80 leading-relaxed text-lg">
						Gracias por llenar mis días de luz, por cada sonrisa y por cada momento que compartimos juntos. Hoy celebramos tu vida, tu belleza (especialmente esos cachetes que me encantan), y todo lo increíble que eres.
					</p>
					<div className="pt-8">
						<svg className="w-8 h-8 text-rose-400 mx-auto animate-pulse-soft" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
						</svg>
					</div>
				</motion.div>
			</div>
		</ConstellationBackground>
	)
}
