'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const PRANK_PRIZES = [
	{ id: 1, text: 'Sigue intentando', icon: <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
	{ id: 2, text: 'Un fuerte abrazo', icon: <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
	{ id: 3, text: 'Mordida de cachete', icon: <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
]

const REAL_PRIZES = [
	{ id: 4, text: 'Mini Cooper', icon: <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2m14 0a2 2 0 11-4 0 2 2 0 014 0zM8 17a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
	{ id: 5, text: 'Viaje a Japón', icon: <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
	{ id: 6, text: 'Anillo de diamantes', icon: <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> }
]

const COUPONS = [
	{ id: 1, title: 'Cita Misteriosa', desc: 'Tú eliges fecha, yo planeo todo', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
	{ id: 2, title: 'Picnic Romántico', desc: 'Con tus snacks favoritos', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> },
	{ id: 3, title: 'Desayuno Sorpresa', desc: 'A la cama con mucho amor', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
	{ id: 4, title: 'Karaoke Privado', desc: 'Cantamos hasta quedarnos sin voz', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> },
	{ id: 5, title: 'Te consiento hoy', desc: 'Yo cocino y planeo', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
	{ id: 6, title: 'Cita Elegante', desc: 'Nos vestimos fancy para cenar', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg> },
	{ id: 7, title: 'Show Privado', desc: 'De tu striper personal', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
	{ id: 8, title: 'Mordida de Nalga', desc: 'Permiso concedido', icon: <svg className="w-10 h-10 text-pink-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> }
]

export default function BirthdayFlow() {
	const [state, setState] = useState(0) // 0: PIN, 1: Pranks, 2: Run1, 3: Coupons1, 4: Run2, 5: Coupons2, 6: End
	const [pin, setPin] = useState('')
	const [error, setError] = useState(false)
	
	// State 1
	const [selectedGifts, setSelectedGifts] = useState<number[]>([])
	const [revealed, setRevealed] = useState(false)
	
	// States 2 & 4
	const [runawayAttempts, setRunawayAttempts] = useState(0)
	const [runawayPos, setRunawayPos] = useState({ x: 0, y: 0 })
	const [noScale, setNoScale] = useState(1)
	const [showPopup, setShowPopup] = useState(false)
	
	// State 6
	const [isSaving, setIsSaving] = useState(false)
	const [saved, setSaved] = useState(false)

	const handlePinSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (pin === '0103' || pin === '3186' || pin === 'tefy') { // Accepting common pins
			document.documentElement.requestFullscreen().catch(() => {})
			document.querySelector('nav')?.classList.add('hidden')
			setState(1)
		} else {
			setError(true)
			setPin('')
			setTimeout(() => setError(false), 2000)
		}
	}

	const handleGiftClick = (index: number) => {
		if (selectedGifts.length >= 3 || selectedGifts.includes(index)) return
		const newSelected = [...selectedGifts, index]
		setSelectedGifts(newSelected)
		if (newSelected.length === 3) {
			setTimeout(() => setRevealed(true), 1500)
		}
	}

	const handleRunawayYes = () => {
		if (runawayAttempts < 6) {
			setRunawayPos({ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 300 })
			setRunawayAttempts(a => a + 1)
		} else {
			if (state === 4) {
				setShowPopup(true)
				setTimeout(() => {
					setShowPopup(false)
					setState(5)
				}, 3000)
			} else {
				setState(3)
			}
		}
	}

	const handleRunawayNo = () => {
		setNoScale(s => s * 1.1)
	}

	const handleSave = async () => {
		setIsSaving(true)
		// Mock de guardar en la base de datos
		await new Promise(r => setTimeout(r, 2000))
		setIsSaving(false)
		setSaved(true)
	}

	// Restaurar Nav al desmontar
	useEffect(() => {
		return () => {
			document.querySelector('nav')?.classList.remove('hidden')
			if (document.fullscreenElement) {
				document.exitFullscreen().catch(() => {})
			}
		}
	}, [])

	if (state === 0) {
		return (
			<div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 text-white min-h-[100dvh]">
				<motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center">
					<h1 className="font-display text-4xl font-bold mb-4 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]">
						Área Restringida
					</h1>
					<p className="mb-8 text-white/60">Introduce el código para acceder a tu regalo</p>
					<form onSubmit={handlePinSubmit} className="space-y-6">
						<input
							type="password"
							value={pin}
							onChange={e => setPin(e.target.value)}
							className={`w-full bg-white/5 border ${error ? 'border-rose-500' : 'border-pink-500/30'} rounded-2xl p-4 text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:border-pink-500 transition-colors`}
							placeholder="••••"
							autoFocus
						/>
						<button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-lg shadow-pink-500/30 active:scale-95 transition-transform">
							Acceder
						</button>
					</form>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 z-[9999] bg-gradient-to-br from-indigo-950 via-slate-900 to-pink-950 overflow-y-auto overflow-x-hidden p-6 flex flex-col items-center justify-center min-h-[100dvh]">
			<AnimatePresence mode="wait">
				{state === 1 && (
					<motion.div key="state1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-2xl text-center">
						<h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 text-pink-300">Feliz Cumpleaños Mi Amor</h2>
						<p className="text-xl text-white/80 mb-8 font-light tracking-wide">Selecciona 3 regalos que serán tuyos...</p>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
							{Array.from({ length: 6 }).map((_, i) => {
								const isSelected = selectedGifts.includes(i)
								const selectionIndex = selectedGifts.indexOf(i)
								
								// Si ya se revelaron y no fue elegido, le asignamos un real prize
								const unselectedIdx = Array.from({length:6}).filter(x => !selectedGifts.includes(x as number)).indexOf(i)
								
								const item = isSelected 
									? PRANK_PRIZES[selectionIndex] 
									: (revealed ? REAL_PRIZES[unselectedIdx] : null)

								return (
									<motion.div
										key={i}
										onClick={() => handleGiftClick(i)}
										whileHover={!isSelected && !revealed ? { scale: 1.05 } : {}}
										whileTap={!isSelected && !revealed ? { scale: 0.95 } : {}}
										className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer p-4 border  transition-all duration-500 ${
											isSelected || revealed 
												? (isSelected ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-white/5 border-white/20 opacity-50 grayscale') 
												: 'bg-gradient-to-br from-rose-400/80 to-pink-600/80 border-rose-300 shadow-xl'
										}`}
										style={{ transformStyle: 'preserve-3d' }}
									>
										{item ? (
											<motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className="text-center flex flex-col items-center">
												<div className="mb-3">{item.icon}</div>
												<div className={`text-sm md:text-base font-bold text-white ${!isSelected ? 'text-white/60' : ''}`}>{item.text}</div>
											</motion.div>
										) : (
											<div className="text-white/90 drop-shadow-md">
												<svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
												</svg>
											</div>
										)}
									</motion.div>
								)
							})}
						</div>
						{revealed && (
							<motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setState(2)} className="py-4 px-10 rounded-full bg-white text-pink-600 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all">
								Reclamar mis premios 😢
							</motion.button>
						)}
					</motion.div>
				)}

				{(state === 2 || state === 4) && (
					<motion.div key={`run-${state}`} className="w-full flex justify-center items-center flex-col min-h-screen relative overflow-hidden">
						{showPopup && (
							<motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute z-50 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 text-center max-w-sm shadow-[0_0_50px_rgba(236,72,153,0.5)]">
								<h3 className="text-2xl font-display font-bold text-pink-300 mb-2">¡Awww!</h3>
								<p className="text-white">Bueno, te los daré porque te amo mucho ❤️</p>
							</motion.div>
						)}
						<h2 className="font-display text-4xl font-bold text-white mb-12 text-center max-w-md mx-auto">
							{state === 2 ? "¿Quieres otro intento para regalos de verdad?" : "¿Quieres MÁS cupones?"}
						</h2>
						<div className="flex gap-10 items-center justify-center relative w-full h-40">
							<motion.button
								onClick={handleRunawayYes}
								onHoverStart={handleRunawayYes}
								animate={{
									x: runawayPos.x,
									y: runawayPos.y,
									scale: Math.pow(0.9, runawayAttempts)
								}}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className="absolute z-10 py-4 px-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]"
							>
								¡SÍ!
							</motion.button>
							<motion.button
								onClick={handleRunawayNo}
								animate={{ scale: noScale }}
								className="py-4 px-12 rounded-full bg-slate-800 text-white font-bold text-xl border border-slate-600 hover:bg-slate-700"
							>
								NO
							</motion.button>
						</div>
					</motion.div>
				)}

				{state === 3 && (
					<motion.div key="coupons1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-4xl text-center">
						<h2 className="font-display text-4xl font-bold text-white mb-4 text-pink-300">Tus Cupones Reales</h2>
						<p className="text-white/70 mb-10">Ya que perdiste los otros... aquí tienes algo mejor.</p>
						<div className="grid md:grid-cols-3 gap-6 mb-12">
							{COUPONS.slice(0, 3).map(coupon => <CouponCard key={coupon.id} coupon={coupon} />)}
						</div>
						<motion.button onClick={() => { setRunawayAttempts(0); setRunawayPos({x:0,y:0}); setState(4) }} className="py-4 px-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all">
							Siguiente →
						</motion.button>
					</motion.div>
				)}

				{state === 5 && (
					<motion.div key="coupons2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl text-center py-10">
						<h2 className="font-display text-4xl font-bold text-white mb-2 text-pink-300">Todos TUS Cupones</h2>
						<p className="text-white/70 mb-10">Para canjear cuando quieras. Tócalos para ver los términos.</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
							{COUPONS.map(coupon => <CouponCard key={coupon.id} coupon={coupon} />)}
						</div>
						<motion.button onClick={() => setState(6)} className="py-4 px-12 rounded-full bg-white text-pink-600 font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all">
							Finalizar y Guardar
						</motion.button>
					</motion.div>
				)}

				{state === 6 && (
					<motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.3)]">
						{!saved ? (
							<>
								<svg className="w-20 h-20 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
									<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.485l-8.828-8.829a4 4 0 010-5.656z" clipRule="evenodd" />
								</svg>
								<h2 className="font-display text-3xl font-bold text-white mb-6">Guardar Regalos</h2>
								<p className="text-white/70 mb-8">Todos estos cupones se asociarán a tu cuenta &apos;TeFy&apos; para toda la vida.</p>
								<button 
									onClick={handleSave} 
									disabled={isSaving}
									className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
								>
									{isSaving ? (
										<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
									) : 'Añadir a mi cuenta'}
								</button>
							</>
						) : (
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
								<div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-pink-400 shadow-[0_0_30px_rgba(244,114,182,0.6)] flex items-center justify-center bg-pink-100/10">
									<svg className="w-24 h-24 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>
								</div>
								<h2 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400 mb-4">¡Feliz Cumpleaños!</h2>
								<p className="text-white/90 font-light mb-8">Disfruta tus regalos, galleta hermosa. Te amo infinito.</p>
								<div className="inline-flex bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/30 text-sm">
									✓ Guardado exitosamente
								</div>
							</motion.div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

function CouponCard({ coupon }: { coupon: typeof COUPONS[0] }) {
	const [isFlipped, setIsFlipped] = useState(false)

	return (
		<div className="relative aspect-[4/3] w-full perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
			<motion.div
				animate={{ rotateY: isFlipped ? 180 : 0 }}
				transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
				className="w-full h-full relative [transform-style:preserve-3d]"
			>
				{/* Front */}
				<div className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl border-2 border-pink-300 p-4 flex flex-col items-center justify-center text-center shadow-lg group-hover:shadow-[0_0_20px_rgba(244,114,182,0.4)] transition-shadow">
					<div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-900 rounded-r-full" />
					<div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-900 rounded-l-full" />
					<div className="mb-3">{coupon.icon}</div>
					<h3 className="font-display font-bold text-pink-900 leading-tight mb-1">{coupon.title}</h3>
					<p className="text-xs text-pink-700/80">{coupon.desc}</p>
				</div>
				
				{/* Back */}
				<div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-2xl border-2 border-pink-200 p-4 flex flex-col items-center justify-center text-center shadow-lg [transform:rotateY(180deg)]">
					<p className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-2">Términos</p>
					<p className="text-sm text-slate-600 font-medium italic mb-2 px-2">Válido por 1 uso. No reembolsable por enojos. Exclusivo para TeFy.</p>
					<div className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-mono">CODE: CUMPLE-{coupon.id}00</div>
				</div>
			</motion.div>
		</div>
	)
}
