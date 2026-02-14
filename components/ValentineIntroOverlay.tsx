'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const OVERLAY_Z = 9999

type Screen = 'question' | 'yes' | 'no'

export default function ValentineIntroOverlay() {
	const [showIntro, setShowIntro] = useState(true)
	const [screen, setScreen] = useState<Screen>('question')
	const [isClosing, setIsClosing] = useState(false)

	const handleYes = useCallback(() => {
		setScreen('yes')
	}, [])

	const handleNo = useCallback(() => {
		setScreen('no')
	}, [])

	const closeOverlay = useCallback(() => {
		setIsClosing(true)
		setTimeout(() => setShowIntro(false), 500)
	}, [])

	useEffect(() => {
		if (!showIntro) return
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = ''
		}
	}, [showIntro])

	if (!showIntro) return null

	return (
		<motion.div
			className="fixed inset-0 w-[100vw] h-[100vh] flex items-center justify-center overflow-hidden"
			style={{ zIndex: OVERLAY_Z }}
			initial={false}
			animate={{
				opacity: isClosing ? 0 : 1,
				transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
			}}
			transition={{ duration: 0.5 }}
		>
			{/* Fondo: gradiente azul aguamarina + luz suave */}
			<div
				className="absolute inset-0"
				style={{
					background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 25%, #5eead4 50%, #14b8a6 75%, #0d9488 100%)',
				}}
			/>
			<div
				className="absolute inset-0 opacity-60"
				style={{
					background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255,255,255,0.85) 0%, transparent 55%)',
				}}
			/>
			{/* Corazones flotantes sutiles */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(6)].map((_, i) => (
					<motion.span
						key={i}
						className="absolute"
						style={{ color: 'rgba(13, 148, 136, 0.35)' }}
						style={{
							left: `${15 + i * 16}%`,
							top: `${20 + (i % 3) * 25}%`,
							fontSize: 'clamp(20px, 4vw, 36px)',
						}}
						animate={{
							y: [0, -12, 0],
							opacity: [0.3, 0.6, 0.3],
							scale: [1, 1.05, 1],
						}}
						transition={{
							duration: 3 + i * 0.4,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: i * 0.2,
						}}
					>
						♥
					</motion.span>
				))}
			</div>

			<AnimatePresence mode="wait">
				{screen === 'question' && (
					<motion.div
						key="question"
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ type: 'spring', damping: 22, stiffness: 260 }}
						className="relative w-[min(92vw,420px)]"
					>
						{/* Tarjeta principal con borde elegante */}
						<div
							className="relative rounded-3xl p-8 md:p-10 flex flex-col items-center text-center overflow-hidden"
							style={{
								background: 'linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)',
								boxShadow: `
									0 0 0 2px rgba(20, 184, 166, 0.25),
									0 0 0 4px rgba(255, 255, 255, 0.8),
									0 25px 50px -12px rgba(13, 148, 136, 0.28),
									0 8px 24px -8px rgba(0,0,0,0.1)
								`,
								border: '2px solid rgba(94, 234, 212, 0.7)',
							}}
						>
							{/* Detalle superior tipo cinta */}
							<div
								className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl opacity-90"
								style={{
									background: 'linear-gradient(90deg, transparent, #5eead4, #14b8a6, #0d9488, #5eead4, transparent)',
								}}
							/>

							<motion.p
								className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-gray-800 mt-2 mb-10"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.5 }}
								style={{
									textShadow: '0 1px 2px rgba(0,0,0,0.06)',
									letterSpacing: '0.02em',
								}}
							>
								Mi cachetona, ¿quieres ser mi Valentine?
							</motion.p>

							<div className="flex flex-wrap items-center justify-center gap-4">
								<motion.button
									type="button"
									onClick={handleYes}
									className="px-10 py-4 rounded-2xl font-display text-lg font-semibold text-white shadow-lg"
									style={{
										background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
										boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
										border: '1px solid rgba(255,255,255,0.3)',
									}}
									whileHover={{ scale: 1.05, boxShadow: '0 8px 28px rgba(16, 185, 129, 0.5)' }}
									whileTap={{ scale: 0.98 }}
									transition={{ type: 'spring', stiffness: 400, damping: 20 }}
								>
									Sí
								</motion.button>

								<motion.button
									type="button"
									onClick={handleNo}
									className="px-10 py-4 rounded-2xl font-display text-lg font-semibold text-white"
									style={{
										background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
										boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
										border: '1px solid rgba(255,255,255,0.25)',
									}}
									whileHover={{ scale: 1.05, boxShadow: '0 8px 28px rgba(220, 38, 38, 0.45)' }}
									whileTap={{ scale: 0.98 }}
									transition={{ type: 'spring', stiffness: 400, damping: 20 }}
								>
									No
								</motion.button>
							</div>
						</div>
					</motion.div>
				)}

				{screen === 'yes' && (
					<motion.div
						key="yes"
						initial={{ opacity: 0, scale: 0.85 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ type: 'spring', damping: 22, stiffness: 260 }}
						className="relative w-[min(92vw,380px)]"
					>
						<div
							className="relative rounded-3xl p-8 md:p-10 flex flex-col items-center text-center"
							style={{
								background: 'linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(236, 253, 245, 0.95) 100%)',
								boxShadow: `
									0 0 0 2px rgba(20, 184, 166, 0.25),
									0 0 0 4px rgba(255, 255, 255, 0.9),
									0 25px 50px -12px rgba(13, 148, 136, 0.28)
								`,
								border: '2px solid rgba(94, 234, 212, 0.7)',
							}}
						>
							<motion.span
								className="text-5xl md:text-6xl mb-4"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: 'spring', delay: 0.15, stiffness: 300, damping: 18 }}
							>
								💕
							</motion.span>
							<motion.p
								className="font-display text-xl md:text-2xl font-semibold text-gray-800 mb-6 leading-snug"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.25, duration: 0.4 }}
							>
								Te amo mucho cachetes
							</motion.p>
							<motion.button
								type="button"
								onClick={closeOverlay}
								className="px-8 py-3 rounded-xl font-display text-base font-semibold text-white"
								style={{
									background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
									boxShadow: '0 4px 16px rgba(20, 184, 166, 0.45)',
								}}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.98 }}
							>
								Entrar
							</motion.button>
						</div>
					</motion.div>
				)}

				{screen === 'no' && (
					<motion.div
						key="no"
						initial={{ opacity: 0, scale: 0.85 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ type: 'spring', damping: 22, stiffness: 260 }}
						className="relative w-[min(92vw,380px)]"
					>
						<div
							className="relative rounded-3xl p-8 md:p-10 flex flex-col items-center text-center"
							style={{
								background: 'linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(236, 253, 245, 0.95) 100%)',
								boxShadow: `
									0 0 0 2px rgba(20, 184, 166, 0.25),
									0 0 0 4px rgba(255, 255, 255, 0.9),
									0 25px 50px -12px rgba(13, 148, 136, 0.25)
								`,
								border: '2px solid rgba(94, 234, 212, 0.7)',
							}}
						>
							<motion.span
								className="text-4xl md:text-5xl mb-4"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: 'spring', delay: 0.15, stiffness: 300, damping: 18 }}
							>
								😢
							</motion.span>
							<motion.p
								className="font-display text-xl md:text-2xl font-semibold text-gray-800 mb-6 leading-snug"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.25, duration: 0.4 }}
							>
								¿En serio? Gracias…
							</motion.p>
							<motion.button
								type="button"
								onClick={() => setScreen('question')}
								className="px-8 py-3 rounded-xl font-display text-base font-semibold text-white"
								style={{
									background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
									boxShadow: '0 4px 16px rgba(20, 184, 166, 0.45)',
								}}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.98 }}
							>
								Volver
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
