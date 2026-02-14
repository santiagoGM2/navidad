'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

const OVERLAY_Z = 9999
const EVASIVE_THRESHOLD = 120
const EVASIVE_COOLDOWN_MS = 180

export default function ValentineIntroOverlay() {
	const [showIntro, setShowIntro] = useState(true)
	const [isClosing, setIsClosing] = useState(false)
	const [noButtonPos, setNoButtonPos] = useState({ x: 72, y: 78 })
	const cardRef = useRef<HTMLDivElement>(null)
	const noButtonRef = useRef<HTMLButtonElement>(null)
	const lastEscapeAt = useRef(0)

	const handleYes = useCallback(() => {
		setIsClosing(true)
		setTimeout(() => {
			setShowIntro(false)
		}, 450)
	}, [])

	const getRandomPos = useCallback(() => {
		const x = 15 + Math.random() * 70
		const y = 62 + Math.random() * 28
		return { x, y }
	}, [])

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!cardRef.current || !noButtonRef.current) return
			const now = Date.now()
			if (now - lastEscapeAt.current < EVASIVE_COOLDOWN_MS) return

			const btn = noButtonRef.current.getBoundingClientRect()
			const mx = e.clientX
			const my = e.clientY
			const bx = btn.left + btn.width / 2
			const by = btn.top + btn.height / 2
			const dist = Math.hypot(mx - bx, my - by)

			if (dist < EVASIVE_THRESHOLD) {
				lastEscapeAt.current = now
				setNoButtonPos(getRandomPos())
			}
		},
		[getRandomPos]
	)

	useEffect(() => {
		if (!showIntro) return
		const prev = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = prev
		}
	}, [showIntro])

	if (!showIntro) return null

	return (
		<div
			className="fixed inset-0 w-[100vw] h-[100vh] flex items-center justify-center overflow-hidden"
			style={{
				zIndex: OVERLAY_Z,
				background: 'linear-gradient(160deg, #0d9488 0%, #0f766e 40%, #115e59 100%)',
				opacity: isClosing ? 0 : 1,
				transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
				pointerEvents: isClosing ? 'none' : 'auto',
			}}
			onMouseMove={handleMouseMove}
			role="dialog"
			aria-modal="true"
			aria-label="¿Quieres ser mi Valentín?"
		>
			{/* Brillo sutil de fondo */}
			<div
				className="absolute inset-0 opacity-30"
				style={{
					background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
				}}
				aria-hidden="true"
			/>

			<div
				ref={cardRef}
				className="relative w-[min(92vw,440px)] max-h-[90vh] rounded-3xl p-8 md:p-12 flex flex-col items-center text-center overflow-visible"
				style={{
					background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
					backdropFilter: 'blur(12px)',
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.15)',
				}}
			>
				<p
					className="font-display text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-white mb-8 md:mb-10"
					style={{
						textShadow: '0 2px 12px rgba(0,0,0,0.25)',
						letterSpacing: '0.01em',
					}}
				>
					Mi cachetona, (¿quieres ser mi Valentín o mi San Valentín?)
				</p>

				<div className="w-full flex items-center justify-center gap-4 min-h-[52px]">
					<button
						type="button"
						onClick={handleYes}
						className="px-8 py-3.5 rounded-xl font-display text-lg font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 active:scale-[0.98]"
						style={{
							backgroundColor: '#16a34a',
							boxShadow: '0 4px 20px rgba(22, 163, 74, 0.45)',
						}}
					>
						Sí
					</button>
					<div className="w-[100px] h-[48px] flex-shrink-0" aria-hidden="true" />
				</div>

				<button
					ref={noButtonRef}
					type="button"
					className="absolute select-none pointer-events-none py-3 px-6 rounded-xl font-display text-lg font-semibold text-white transition-all duration-200 ease-out"
					style={{
						left: `${noButtonPos.x}%`,
						top: `${noButtonPos.y}%`,
						transform: 'translate(-50%, -50%)',
						backgroundColor: '#dc2626',
						boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
					}}
					tabIndex={-1}
					aria-hidden="true"
				>
					No
				</button>
			</div>
		</div>
	)
}
