'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── SVG Icon Components ────────────────────────────────────────────────────
const IconGift = ({ className = 'w-12 h-12' }: { className?: string }) => (
	<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
	</svg>
)

const IconSearch = () => <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
const IconStar = () => <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
const IconSun = () => <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
const IconMusic = () => <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
const IconHeart = ({ className = 'w-9 h-9' }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
const IconDine = () => <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>
const IconSparkle = () => <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
const IconCar = () => <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2m14 0a2 2 0 11-4 0 2 2 0 014 0zM8 17a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
const IconPlane = () => <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
const IconIsland = () => <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IconDiamond = () => <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14l3 5-10 13L2 8l3-5z M2 8h20M8.5 3L5 8M15.5 3L19 8" /></svg>
const IconTrophy = () => <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
const IconWarning = () => <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
const IconHug = () => <svg className="w-12 h-12 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
const IconSmile = () => <svg className="w-12 h-12 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IconCheck = () => <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
const IconLock = () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>

// ─── Data ────────────────────────────────────────────────────────────────────
const PRANK_PRIZES = [
	{ id: 1, text: 'Sigue intentando', icon: <IconWarning /> },
	{ id: 2, text: 'Un fuerte abrazo', icon: <IconHug /> },
	{ id: 3, text: 'Mordida de cachete', icon: <IconSmile /> },
]

const REAL_PRIZES_1 = [
	{ id: 4, text: 'Mini Cooper Rojo', sub: '¿Por qué no lo elegiste?', icon: <IconCar /> },
	{ id: 5, text: 'Viaje a Japón', sub: 'Pudo ser tuyo...', icon: <IconPlane /> },
	{ id: 6, text: 'Isla Privada', sub: 'Tú y yo solos', icon: <IconIsland /> },
]

const PRANK_PRIZES_2 = [
	{ id: 1, text: 'Nada, era trampa', icon: <IconWarning /> },
	{ id: 2, text: 'Mis disculpas', icon: <IconSmile /> },
	{ id: 3, text: 'Un beso robado', icon: <IconHug /> },
	{ id: 4, text: 'Mordida de oreja', icon: <IconSmile /> },
	{ id: 5, text: 'Cosquillas gratis', icon: <IconWarning /> },
]

const REAL_PRIZES_2 = [
	{ id: 10, text: 'Anillo de Diamantes', sub: '¿Lo querías, verdad?', icon: <IconDiamond /> },
	{ id: 11, text: 'Viaje a París', sub: 'La Ciudad del Amor', icon: <IconPlane /> },
	{ id: 12, text: 'Apartamento Propio', sub: 'Solo pa ti', icon: <IconTrophy /> },
]

interface Coupon {
	id: number
	title: string
	desc: string
	icon: React.ReactNode
	terms: string
}

const COUPONS: Coupon[] = [
	{ id: 1, title: 'Cita Misteriosa', desc: 'Tú eliges fecha, yo planeo todo', icon: <IconSearch />, terms: 'Válido 1 vez. Debe canjearse con amor. El plan es secreto.' },
	{ id: 2, title: 'Picnic Romántico', desc: 'Manta, snacks y tú', icon: <IconStar />, terms: 'Incluye tus snacks favoritos. No reembolsable por lluvia.' },
	{ id: 3, title: 'Desayuno Sorpresa', desc: 'A la cama, con mucho amor', icon: <IconSun />, terms: 'Yo lo preparo. Sin cargos extra por arreglarte el cabello.' },
	{ id: 4, title: 'Karaoke Privado', desc: 'Cantamos hasta el amanecer', icon: <IconMusic />, terms: 'Sin jueces. Sin vergüenza. Solo nosotros.' },
	{ id: 5, title: 'Te Consiento Hoy', desc: 'Yo cocino, planeo y mimo', icon: <IconHeart className="w-9 h-9 text-pink-600" />, terms: 'Válido 1 día completo. Incluye masajes bajo previa solicitud.' },
	{ id: 6, title: 'Cita Elegante', desc: 'Nos vestimos fancy a cenar', icon: <IconDine />, terms: 'Tú escoges el restaurante. Yo pago y te digo que eres hermosa.' },
	{ id: 7, title: 'Show Privado', desc: 'De tu striper personal', icon: <IconSparkle />, terms: 'Solo para TeFy. No transferible. Confidencial.' },
	{ id: 8, title: 'Mordida de Nalga', desc: 'Permiso oficialmente concedido', icon: <IconHeart className="w-9 h-9 text-rose-600" />, terms: 'Un solo uso. Por amor. Sin previo aviso.' },
]

// ─── Coupon Card ─────────────────────────────────────────────────────────────
function CouponCard({ coupon }: { coupon: Coupon }) {
	const [isFlipped, setIsFlipped] = useState(false)

	return (
		<div
			className="relative w-full cursor-pointer select-none"
			style={{ perspective: '800px', aspectRatio: '3/2' }}
			onClick={() => setIsFlipped(!isFlipped)}
		>
			<motion.div
				animate={{ rotateY: isFlipped ? 180 : 0 }}
				transition={{ duration: 0.6, type: 'spring', stiffness: 220, damping: 22 }}
				style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
			>
				{/* Front */}
				<div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
					className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl border-2 border-pink-300 shadow-xl flex flex-col items-center justify-center p-4 text-center overflow-hidden">
					{/* Notches — ticket effect */}
					<div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-900" />
					<div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-900" />
					{/* Dashed divider */}
					<div className="absolute left-6 right-6 top-1/3 border-t-2 border-dashed border-pink-200" />
					{/* Icon on top */}
					<div className="relative z-10 text-pink-600 mb-1">{coupon.icon}</div>
					{/* Text below divider */}
					<div className="relative z-10 mt-1">
						<h3 className="font-display font-bold text-pink-900 text-sm leading-tight">{coupon.title}</h3>
						<p className="text-xs text-pink-700/70 mt-0.5 leading-tight">{coupon.desc}</p>
					</div>
					{/* Tap hint */}
					<p className="absolute bottom-2 text-pink-400/60 text-[10px] tracking-widest uppercase">Toca para ver términos</p>
				</div>
				{/* Back */}
				<div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
					className="bg-white rounded-2xl border-2 border-pink-100 shadow-xl flex flex-col items-center justify-center p-4 text-center overflow-hidden">
					<div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
					<div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
					<p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">Términos & Condiciones</p>
					<p className="text-sm text-slate-600 italic leading-snug px-2">{coupon.terms}</p>
					<div className="mt-3 bg-pink-50 border border-pink-200 text-pink-500 rounded-full px-3 py-1 text-xs font-mono">
						CUMPLE-{coupon.id.toString().padStart(3, '0')} · Solo TeFy
					</div>
				</div>
			</motion.div>
		</div>
	)
}

// ─── Gift Box ─────────────────────────────────────────────────────────────────
function GiftBox({ onClick, isSelected, revealed, prankItem, realItem, ribbonColor }: {
	onClick: () => void
	isSelected: boolean
	revealed: boolean
	prankItem?: typeof PRANK_PRIZES[0]
	realItem?: typeof REAL_PRIZES_1[0]
	ribbonColor: string
}) {
	const item = isSelected ? prankItem : (revealed ? realItem : null)

	return (
		<motion.div
			onClick={onClick}
			whileHover={!isSelected && !revealed ? { scale: 1.04, y: -4 } : {}}
			whileTap={!isSelected && !revealed ? { scale: 0.96 } : {}}
			className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer p-3 border-2 transition-all duration-500 ${
				isSelected
					? 'bg-rose-500/10 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
					: revealed && realItem
						? 'bg-violet-500/10 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.35)]'
						: 'bg-gradient-to-br from-rose-400/90 to-pink-600/90 border-rose-200 shadow-2xl'
			}`}
		>
			{/* Ribbon decoration — only when still hidden */}
			{!item && (
				<>
					<div className={`absolute inset-x-0 top-0 h-1/4 ${ribbonColor} rounded-t-2xl opacity-60`} />
					<div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[18%] ${ribbonColor} opacity-60`} />
					{/* Bow */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
						<div className={`w-8 h-6 ${ribbonColor} rounded-full opacity-90 shadow-lg`} />
					</div>
					<div className="absolute top-1/4 flex items-center justify-center">
						<IconGift className="w-12 h-12 text-white/90 drop-shadow-lg" />
					</div>
				</>
			)}

			{/* Revealed content */}
			{item && (
				<motion.div
					initial={{ scale: 0, rotate: -10 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 18 }}
					className="flex flex-col items-center text-center gap-1"
				>
					{item.icon}
					<p className="text-white text-xs font-bold leading-tight mt-1">{item.text}</p>
					{(item as typeof REAL_PRIZES_1[0]).sub && (
						<p className="text-violet-200 text-[10px] leading-tight">{(item as typeof REAL_PRIZES_1[0]).sub}</p>
					)}
				</motion.div>
			)}
		</motion.div>
	)
}

// ─── Runaway Button ───────────────────────────────────────────────────────────
function RunawayYesButton({ onEscape, attempts }: { onEscape: () => void, attempts: number }) {
	const [pos, setPos] = useState({ x: 0, y: 0 })
	const containerRef = useRef<HTMLDivElement>(null)
	const escaped = attempts >= 6

	const flee = () => {
		if (escaped) return
		const container = containerRef.current?.getBoundingClientRect()
		if (!container) return
		const maxX = Math.min(container.width * 0.35, 120)
		const maxY = Math.min(container.height * 0.35, 100)
		const nx = (Math.random() - 0.5) * maxX * 2
		const ny = (Math.random() - 0.5) * maxY * 2
		setPos({ x: nx, y: ny })
	}

	return (
		<div ref={containerRef} className="relative flex items-center justify-center w-48 h-20">
			<motion.button
				animate={{ x: pos.x, y: pos.y, scale: escaped ? 1 : Math.pow(0.92, attempts) }}
				transition={{ type: 'spring', stiffness: 350, damping: 25 }}
				onHoverStart={flee}
				onTouchStart={flee}
				onClick={() => {
					if (escaped) onEscape()
					else flee()
				}}
				className="absolute py-3 px-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95"
			>
				SÍ
			</motion.button>
		</div>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BirthdayFlow() {
	const [state, setState] = useState(0)
	const [pin, setPin] = useState('')
	const [pinError, setPinError] = useState(false)

	// State 1 — first gift round
	const [selectedGifts1, setSelectedGifts1] = useState<number[]>([])
	const [revealed1, setRevealed1] = useState(false)

	// State 4 — second gift round
	const [selectedGifts2, setSelectedGifts2] = useState<number[]>([])
	const [revealed2, setRevealed2] = useState(false)

	// Runaway attempts tracker (reused per state)
	const [attempts2, setAttempts2] = useState(0)
	const [attempts4, setAttempts4] = useState(0)
	const [noScale2, setNoScale2] = useState(1)
	const [noScale4, setNoScale4] = useState(1)
	const [showPopup4, setShowPopup4] = useState(false)

	// State 6
	const [isSaving, setIsSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [saveError, setSaveError] = useState('')

	const RIBBON_COLORS = [
		'bg-violet-400', 'bg-pink-400', 'bg-amber-400',
		'bg-teal-400', 'bg-rose-400', 'bg-indigo-400',
	]

	const RIBBON_COLORS_8 = [
		'bg-violet-400', 'bg-pink-400', 'bg-amber-400',
		'bg-teal-400', 'bg-rose-400', 'bg-indigo-400', 'bg-cyan-400', 'bg-fuchsia-400',
	]

	const handlePinSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const clean = pin.replace(/\D/g, '')
		if (clean === '3186' || pin.toLowerCase() === 'tefy') {
			document.documentElement.requestFullscreen?.().catch(() => { })
			document.querySelector('nav')?.classList.add('!hidden')
			setState(1)
		} else {
			setPinError(true)
			setPin('')
			setTimeout(() => setPinError(false), 1800)
		}
	}

	const handleGift1Click = (i: number) => {
		if (selectedGifts1.length >= 3 || selectedGifts1.includes(i)) return
		const next = [...selectedGifts1, i]
		setSelectedGifts1(next)
		if (next.length === 3) setTimeout(() => setRevealed1(true), 1200)
	}

	const handleGift2Click = (i: number) => {
		if (selectedGifts2.length >= 5 || selectedGifts2.includes(i)) return
		const next = [...selectedGifts2, i]
		setSelectedGifts2(next)
		if (next.length === 5) setTimeout(() => setRevealed2(true), 1200)
	}

	const handleSave = async () => {
		setIsSaving(true)
		setSaveError('')
		try {
			const res = await fetch('/api/coupons/save', { method: 'POST' })
			if (!res.ok) {
				const d = await res.json().catch(() => ({}))
				setSaveError(d.error || 'Error al guardar')
			} else {
				setSaved(true)
			}
		} catch {
			setSaveError('Error de red, intenta de nuevo')
		} finally {
			setIsSaving(false)
		}
	}

	useEffect(() => {
		return () => {
			document.querySelector('nav')?.classList.remove('!hidden')
			if (document.fullscreenElement) document.exitFullscreen?.().catch(() => { })
		}
	}, [])

	// ── Unselected index helpers
	const unselectedIndexes1 = Array.from({ length: 6 }, (_, i) => i).filter(i => !selectedGifts1.includes(i))
	const unselectedIndexes2 = Array.from({ length: 8 }, (_, i) => i).filter(i => !selectedGifts2.includes(i))

	// ─────────────────────────── RENDER ───────────────────────────────────────

	// State 0 — PIN
	if (state === 0) {
		return (
			<div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-rose-950/30 to-slate-950 flex items-center justify-center p-6">
				<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="w-20 h-20 mx-auto bg-gradient-to-tr from-rose-600 to-pink-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] mb-5 rotate-3">
							<IconLock />
						</div>
						<h1 className="font-display text-3xl font-bold text-white mb-2">Sorpresa Secreta</h1>
						<p className="text-white/50 text-sm">Ingresa el código para acceder</p>
					</div>
					<form onSubmit={handlePinSubmit} className="space-y-4">
						<input
							type="password"
							inputMode="numeric"
							value={pin}
							onChange={e => setPin(e.target.value)}
							placeholder="••••"
							autoFocus
							className={`w-full bg-white/5 border-2 ${pinError ? 'border-rose-500 animate-pulse' : 'border-white/10 focus:border-pink-500'} rounded-2xl px-6 py-4 text-center text-3xl tracking-[0.6em] text-white font-mono outline-none transition-colors`}
						/>
						{pinError && (
							<motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs text-center font-bold uppercase tracking-widest">
								Código incorrecto
							</motion.p>
						)}
						<button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95 transition-transform">
							Acceder a tu sorpresa
						</button>
					</form>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 z-[9999] bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 overflow-y-auto overflow-x-hidden">
			<div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 py-10">
				<AnimatePresence mode="wait">

					{/* ─── State 1: First Gift Selection ─── */}
					{state === 1 && (
						<motion.div key="gifts1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-xl text-center">
							<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-pink-400 text-sm font-mono uppercase tracking-widest mb-2">Feliz Cumpleaños</motion.p>
							<h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Elige tus 3 regalos</h2>
							<p className="text-white/50 text-sm mb-8">Selecciona 3 cajas. Lo que escojas es tuyo.</p>

							<div className="grid grid-cols-3 gap-3 mb-6">
								{Array.from({ length: 6 }).map((_, i) => {
									const isSelected = selectedGifts1.includes(i)
									const selIdx = selectedGifts1.indexOf(i)
									const unselIdx = unselectedIndexes1.indexOf(i)
									return (
										<GiftBox
											key={i}
											onClick={() => handleGift1Click(i)}
											isSelected={isSelected}
											revealed={revealed1}
											prankItem={isSelected ? PRANK_PRIZES[selIdx] : undefined}
											realItem={!isSelected && revealed1 ? REAL_PRIZES_1[unselIdx] : undefined}
											ribbonColor={RIBBON_COLORS[i]}
										/>
									)
								})}
							</div>

							<AnimatePresence>
								{revealed1 && (
									<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
										<p className="text-white/60 text-sm italic">Eso obtuviste... ¿ves lo que no elegiste? Jajaja</p>
										<motion.button onClick={() => setState(2)} whileTap={{ scale: 0.95 }} className="py-3 px-8 rounded-full bg-white text-pink-600 font-bold shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
											Quiero revancha
										</motion.button>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					)}

					{/* ─── State 2: Runaway Button 1 ─── */}
					{state === 2 && (
						<motion.div key="run1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md text-center px-6">
							<h2 className="font-display text-3xl font-bold text-white mb-3">Revancha de regalos?</h2>
							<p className="text-white/50 text-sm mb-12">Quizás ahora sí tengas mejor suerte...</p>
							<div className="flex flex-col items-center gap-8">
								<div className="relative w-full h-24 flex items-center justify-center">
									<RunawayYesButton attempts={attempts2} onEscape={() => setState(3)} />
								</div>
								<motion.button
									animate={{ scale: noScale2 }}
									onClick={() => setNoScale2(s => s * 1.1)}
									className="py-3 px-10 rounded-full bg-slate-800 border border-slate-600 text-white font-bold text-lg active:scale-95"
								>
									NO
								</motion.button>
								<p className="text-white/30 text-xs">El &quot;SÍ&quot; es un poco... escurridizo</p>
							</div>
						</motion.div>
					)}

					{/* ─── State 3: Second Gift Selection ─── */}
					{state === 3 && (
						<motion.div key="gifts2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-xl text-center">
							<p className="text-pink-400 text-sm font-mono uppercase tracking-widest mb-2">Segunda oportunidad</p>
							<h2 className="font-display text-3xl font-bold text-white mb-2">Elige 5 regalos</h2>
							<p className="text-white/50 text-sm mb-8">Esta vez son 8 cajas. Lo que escojas es lo que te llevas.</p>

							<div className="grid grid-cols-4 gap-2 mb-6">
								{Array.from({ length: 8 }).map((_, i) => {
									const isSelected = selectedGifts2.includes(i)
									const selIdx = selectedGifts2.indexOf(i)
									const unselIdx = unselectedIndexes2.indexOf(i)
									const prankData = PRANK_PRIZES_2[selIdx] ?? PRANK_PRIZES_2[0]
									const realData = REAL_PRIZES_2[unselIdx] ?? REAL_PRIZES_2[0]
									return (
										<GiftBox
											key={i}
											onClick={() => handleGift2Click(i)}
											isSelected={isSelected}
											revealed={revealed2}
											prankItem={isSelected ? { ...prankData, icon: prankData.icon } : undefined}
											realItem={!isSelected && revealed2 ? { ...realData, icon: realData.icon } : undefined}
											ribbonColor={RIBBON_COLORS_8[i]}
										/>
									)
								})}
							</div>

							<AnimatePresence>
								{revealed2 && (
									<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
										<p className="text-white/60 text-sm italic">Mira lo que no elegiste... otra vez jaja. Pero tengo algo mejor para ti.</p>
										<motion.button onClick={() => setState(4)} whileTap={{ scale: 0.95 }} className="py-3 px-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_0_25px_rgba(236,72,153,0.4)]">
											Ver mis cupones reales
										</motion.button>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					)}

					{/* ─── State 4: Runaway Button 2 → More Coupons ─── */}
					{state === 4 && (
						<motion.div key="run2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md text-center px-6">
							{showPopup4 && (
								<motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
									<div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(236,72,153,0.5)] max-w-sm mx-4">
										<div className="flex justify-center mb-3"><IconHeart className="w-12 h-12 text-pink-400" /></div>
										<h3 className="text-2xl font-display font-bold text-white mb-2">Claro que sí</h3>
										<p className="text-white/80">Porque te amo mucho, tienes todos los cupones.</p>
									</div>
								</motion.div>
							)}
							<h2 className="font-display text-3xl font-bold text-white mb-3">Quieres los 8 cupones?</h2>
							<p className="text-white/50 text-sm mb-12">Todos son para ti, pero tienes que pedirlos...</p>
							<div className="flex flex-col items-center gap-8">
								<div className="relative w-full h-24 flex items-center justify-center">
									<RunawayYesButton
										attempts={attempts4}
										onEscape={() => {
											setShowPopup4(true)
											setTimeout(() => { setShowPopup4(false); setState(5) }, 2800)
										}}
									/>
								</div>
								<motion.button
									animate={{ scale: noScale4 }}
									onClick={() => setNoScale4(s => s * 1.1)}
									className="py-3 px-10 rounded-full bg-slate-800 border border-slate-600 text-white font-bold text-lg active:scale-95"
								>
									NO
								</motion.button>
							</div>
						</motion.div>
					)}

					{/* ─── State 5: All Coupons ─── */}
					{state === 5 && (
						<motion.div key="coupons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-2xl text-center">
							<p className="text-pink-400 text-sm font-mono uppercase tracking-widest mb-2">Tus regalos de verdad</p>
							<h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">8 Cupones de Amor</h2>
							<p className="text-white/50 text-sm mb-8">Toca cada uno para ver los términos. Son todos tuyos.</p>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
								{COUPONS.map(c => <CouponCard key={c.id} coupon={c} />)}
							</div>
							<motion.button onClick={() => setState(6)} whileTap={{ scale: 0.95 }} className="py-4 px-10 rounded-full bg-white text-pink-600 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:scale-105 transition-transform">
								Guardar en mi cuenta
							</motion.button>
						</motion.div>
					)}

					{/* ─── State 6: Save & Final ─── */}
					{state === 6 && (
						<motion.div key="end" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
							{!saved ? (
								<div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(236,72,153,0.2)]">
									<div className="flex justify-center mb-5">
										<IconHeart className="w-20 h-20 text-pink-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
									</div>
									<h2 className="font-display text-3xl font-bold text-white mb-3">Guardar Regalos</h2>
									<p className="text-white/60 mb-8 text-sm leading-relaxed">
										Estos 8 cupones quedarán asociados a tu cuenta <span className="text-pink-400 font-semibold">TeFy</span> para siempre.
									</p>
									{saveError && (
										<p className="text-rose-400 text-sm mb-4 bg-rose-500/10 rounded-xl px-4 py-2">{saveError}</p>
									)}
									<button
										onClick={handleSave}
										disabled={isSaving}
										className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-60"
									>
										{isSaving
											? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
											: 'Añadir a mi cuenta'
										}
									</button>
								</div>
							) : (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: 'spring', stiffness: 200, damping: 15 }}
										className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-[0_0_40px_rgba(244,114,182,0.6)]"
									>
										<IconHeart className="w-16 h-16 text-white" />
									</motion.div>
									<div>
										<h2 className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400 mb-3">
											Feliz Cumpleanos!
										</h2>
										<p className="text-white/80 font-light text-lg leading-relaxed mb-2">
											Disfruta tus regalos, cachetona hermosa.
										</p>
										<p className="text-white/50 text-sm">Te amo infinito y un poquito mas.</p>
									</div>
									<div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-full text-sm font-medium">
										<IconCheck />
										Cupones guardados en tu cuenta
									</div>
									<p className="text-white/30 text-xs">Puedes revisarlos en el panel de administracion</p>
								</motion.div>
							)}
						</motion.div>
					)}

				</AnimatePresence>
			</div>
		</div>
	)
}
