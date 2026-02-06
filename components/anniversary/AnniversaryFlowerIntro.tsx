'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

type TulipColor = string

/** Single tulip that blooms and floats in */
function IntroTulip({
	color,
	delay,
	leftPct,
	topPct,
	size,
	rotation,
	reduceMotion,
}: {
	color: TulipColor
	delay: number
	leftPct: number
	topPct: number
	size: number
	rotation: number
	reduceMotion: boolean | null
}) {
	return (
		<motion.svg
			viewBox="0 0 40 56"
			className="absolute -translate-x-1/2 -translate-y-1/2"
			style={{
				width: size,
				height: size * (56 / 40),
				left: `${leftPct}%`,
				top: `${topPct}%`,
				transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
			}}
			initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3, y: 40 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
			aria-hidden
		>
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(72 20 22)" />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(144 20 22)" />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(216 20 22)" />
			<ellipse cx="20" cy="22" rx="12" ry="18" fill={color} transform="rotate(288 20 22)" />
			<circle cx="20" cy="22" r="4" fill="rgba(255,255,255,0.35)" />
			<rect x="18" y="38" width="4" height="18" rx="2" fill="rgba(34, 197, 94, 0.85)" />
		</motion.svg>
	)
}

/** Small filler flower */
function IntroSmallFlower({
	color,
	delay,
	leftPct,
	topPct,
	size,
	reduceMotion,
}: {
	color: string
	delay: number
	leftPct: number
	topPct: number
	size: number
	reduceMotion: boolean | null
}) {
	return (
		<motion.svg
			viewBox="0 0 24 24"
			className="absolute -translate-x-1/2 -translate-y-1/2"
			style={{ width: size, height: size, left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
			initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.9, delay, type: 'spring', stiffness: 100 }}
			aria-hidden
		>
			<circle cx="12" cy="12" r="3" fill="rgba(255,220,150,0.9)" />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<ellipse key={i} cx="12" cy="12" rx="2" ry="6" fill={color} transform={`rotate(${i * 60} 12 12)`} />
			))}
		</motion.svg>
	)
}

/** Bouquet layout: positions (%, %) and sizes for a large centered bouquet */
function useBouquetLayout() {
	return useMemo(() => {
		const tulips: Array<{ color: string; delay: number; leftPct: number; topPct: number; size: number; rotation: number }> = [
			{ color: '#f472b6', delay: 0.1, leftPct: 38, topPct: 55, size: 42, rotation: -15 },
			{ color: '#c084fc', delay: 0.2, leftPct: 50, topPct: 52, size: 48, rotation: -5 },
			{ color: '#f59e0b', delay: 0.3, leftPct: 62, topPct: 55, size: 42, rotation: 8 },
			{ color: '#ec4899', delay: 0.25, leftPct: 34, topPct: 60, size: 36, rotation: -20 },
			{ color: '#fbbf24', delay: 0.35, leftPct: 66, topPct: 60, size: 36, rotation: 18 },
			{ color: '#e879f9', delay: 0.15, leftPct: 42, topPct: 50, size: 40, rotation: -8 },
			{ color: '#fb923c', delay: 0.4, leftPct: 58, topPct: 50, size: 40, rotation: 10 },
			{ color: '#a78bfa', delay: 0.45, leftPct: 44, topPct: 58, size: 32, rotation: 0 },
			{ color: '#f87171', delay: 0.5, leftPct: 56, topPct: 58, size: 32, rotation: 5 },
		]
		const small: Array<{ color: string; delay: number; leftPct: number; topPct: number; size: number }> = [
			{ color: '#f472b6', delay: 0.55, leftPct: 28, topPct: 62, size: 22 },
			{ color: '#c084fc', delay: 0.6, leftPct: 72, topPct: 62, size: 22 },
			{ color: '#fbbf24', delay: 0.65, leftPct: 32, topPct: 52, size: 20 },
			{ color: '#e879f9', delay: 0.7, leftPct: 68, topPct: 52, size: 20 },
		]
		return { tulips, small }
	}, [])
}

interface AnniversaryFlowerIntroProps {
	onContinue: () => void
}

export default function AnniversaryFlowerIntro({ onContinue }: AnniversaryFlowerIntroProps) {
	const [showControls, setShowControls] = useState(false)
	const reduceMotion = useReducedMotion()
	const { tulips, small } = useBouquetLayout()

	// After bouquet animation, show OK / X
	useEffect(() => {
		const t = setTimeout(() => setShowControls(true), 3800)
		return () => clearTimeout(t)
	}, [])

	return (
		<motion.div
			className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			style={{
				background: 'linear-gradient(180deg, #0a0612 0%, #150a20 40%, #1a0f2e 100%)',
			}}
			aria-label="Feliz 10 meses - ramo de flores"
		>
			{/* Soft glow */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
				}}
			/>

			{/* Bouquet: percentage-based container so it scales on all screens */}
			<div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: '10%' }}>
				<div className="relative w-[min(88vw,480px)] h-[min(52vh,360px)]">
					{tulips.map((t, i) => (
						<IntroTulip
							key={`t-${i}`}
							color={t.color}
							delay={t.delay}
							leftPct={t.leftPct}
							topPct={t.topPct}
							size={t.size}
							rotation={t.rotation}
							reduceMotion={reduceMotion ?? null}
						/>
					))}
					{small.map((s, i) => (
						<IntroSmallFlower
							key={`s-${i}`}
							color={s.color}
							delay={s.delay}
							leftPct={s.leftPct}
							topPct={s.topPct}
							size={s.size}
							reduceMotion={reduceMotion ?? null}
						/>
					))}
				</div>
			</div>

			{/* Overlay text */}
			<motion.div
				className="relative z-10 text-center px-4 pt-[20%] md:pt-[18%]"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.8, duration: 0.8 }}
			>
				<p
					className="font-display text-xl md:text-2xl lg:text-3xl text-white font-medium leading-relaxed"
					style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.2)' }}
				>
					Feliz 10 meses amor,
					<br />
					te regalé este ramo 💐
				</p>
			</motion.div>

			{/* OK / X controls */}
			<AnimatePresence>
				{showControls && (
					<motion.div
						className="absolute bottom-[10%] left-0 right-0 flex justify-center gap-4 z-20"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
					>
						<motion.button
							type="button"
							onClick={onContinue}
							className="px-8 py-3 rounded-xl font-medium bg-white/15 border border-white/30 text-white backdrop-blur-sm hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							aria-label="Continuar"
						>
							OK
						</motion.button>
						<motion.button
							type="button"
							onClick={onContinue}
							className="px-8 py-3 rounded-xl font-medium bg-white/10 border border-white/20 text-white/90 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							aria-label="Cerrar"
						>
							✕
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
