'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

type TulipColor = string

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
			className="absolute"
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
			className="absolute"
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

function useBouquetLayout() {
	return useMemo(() => {
		const tulips: Array<{ color: string; delay: number; leftPct: number; topPct: number; size: number; rotation: number }> = [
			{ color: '#f472b6', delay: 0.05, leftPct: 32, topPct: 58, size: 52, rotation: -18 },
			{ color: '#c084fc', delay: 0.12, leftPct: 48, topPct: 54, size: 62, rotation: -6 },
			{ color: '#f59e0b', delay: 0.18, leftPct: 64, topPct: 58, size: 52, rotation: 10 },
			{ color: '#ec4899', delay: 0.08, leftPct: 28, topPct: 64, size: 44, rotation: -22 },
			{ color: '#fbbf24', delay: 0.2, leftPct: 70, topPct: 64, size: 44, rotation: 20 },
			{ color: '#e879f9', delay: 0.1, leftPct: 38, topPct: 52, size: 48, rotation: -10 },
			{ color: '#fb923c', delay: 0.22, leftPct: 58, topPct: 52, size: 48, rotation: 12 },
			{ color: '#a78bfa', delay: 0.25, leftPct: 40, topPct: 62, size: 38, rotation: 0 },
			{ color: '#f87171', delay: 0.28, leftPct: 56, topPct: 62, size: 38, rotation: 6 },
			{ color: '#c084fc', delay: 0.14, leftPct: 44, topPct: 48, size: 42, rotation: -8 },
			{ color: '#f472b6', delay: 0.3, leftPct: 52, topPct: 48, size: 42, rotation: 8 },
		]
		const small: Array<{ color: string; delay: number; leftPct: number; topPct: number; size: number }> = [
			{ color: '#f472b6', delay: 0.35, leftPct: 22, topPct: 66, size: 26 },
			{ color: '#c084fc', delay: 0.38, leftPct: 76, topPct: 66, size: 26 },
			{ color: '#fbbf24', delay: 0.32, leftPct: 26, topPct: 54, size: 24 },
			{ color: '#e879f9', delay: 0.4, leftPct: 72, topPct: 54, size: 24 },
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

	useEffect(() => {
		const t = setTimeout(() => setShowControls(true), 4200)
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
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
				}}
			/>

			<div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: '8%' }}>
				<div className="relative w-[min(95vw,620px)] h-[min(65vh,480px)]">
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

			<motion.div
				className="relative z-10 text-center px-4 pt-[12%] md:pt-[10%]"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.8, duration: 0.8 }}
			>
				<p
					className="font-display text-2xl md:text-3xl lg:text-4xl text-white font-medium leading-relaxed"
					style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.2)' }}
				>
					Feliz 10 meses amor.
					<br />
					Te regalé este ramo.
				</p>
			</motion.div>

			<AnimatePresence>
				{showControls && (
					<motion.div
						className="absolute bottom-[12%] left-0 right-0 flex justify-center z-20"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
					>
						<motion.button
							type="button"
							onClick={onContinue}
							className="px-10 py-4 rounded-xl font-medium bg-white/15 border border-white/30 text-white backdrop-blur-sm hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.98 }}
							aria-label="Continuar"
						>
							Continuar
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
