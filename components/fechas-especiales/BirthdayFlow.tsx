'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconGift = () => (
	<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
	</svg>
)
const IconHeart = ({ className = 'w-9 h-9' }: { className?: string }) => (
	<svg className={className} fill="currentColor" viewBox="0 0 24 24">
		<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
	</svg>
)
const IconCheck = () => (
	<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
	</svg>
)
const IconLock = () => (
	<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
	</svg>
)
const IconWarning = () => (
	<svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
	</svg>
)
const IconHug = () => (
	<svg className="w-10 h-10 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
	</svg>
)
const IconSmile = () => (
	<svg className="w-10 h-10 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
)
const IconSearch = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
const IconStar = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
const IconSun = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
const IconMusic = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
const IconDine = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>
const IconSparkle = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>

// ─── Data ────────────────────────────────────────────────────────────────────
const PRANK_PRIZES = [
	{ id: 1, text: 'Te ganaste seguir intentando', sub: 'Mejor suerte la proxima vez', icon: <IconWarning /> },
	{ id: 2, text: 'Te ganaste un abrazo muy fuerte', sub: 'Algo de amor igual', icon: <IconHug /> },
	{ id: 3, text: 'Te ganaste una mordida de cachete', sub: 'jamas falla ;)', icon: <IconSmile /> },
]

const REAL_PRIZES_1 = [
	{ id: 4, text: 'Te perdiste de un Mini Cooper', sub: 'Con tu nombre en la placa!', img: '/images/prize-island.jpg' },
	{ id: 5, text: 'Te perdiste de un viaje a Japon', sub: 'Cerezos, sushi y todo el pack', img: '/images/prize-minicooper.png' },
	{ id: 6, text: 'Te perdiste de una isla privada propia', sub: 'Tu y yo solos en el mar', img: '/images/prize-japan.jpg' },
]

interface Coupon {
	id: number
	title: string
	desc: string
	icon: React.ReactNode
	terms: string
}

const COUPONS: Coupon[] = [
	{ id: 1, title: 'Cita Misteriosa', desc: 'Tu eliges fecha, yo planeo todo', icon: <IconSearch />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 2, title: 'Picnic Romantico', desc: 'Manta, snacks y tu', icon: <IconStar />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 3, title: 'Desayuno Sorpresa', desc: 'A la cama, con mucho amor', icon: <IconSun />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 4, title: 'Karaoke Privado', desc: 'Te canto hasta que te canses de escucharme', icon: <IconMusic />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 5, title: 'Te Consiento Hoy', desc: 'Yo cocino, planeo y mimo', icon: <IconHeart className="w-8 h-8 text-pink-600" />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 6, title: 'Cita Elegante', desc: 'Nos vestimos fancy a cenar', icon: <IconDine />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 7, title: 'Show Privado', desc: 'De tu striper personal', icon: <IconSparkle />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
	{ id: 8, title: 'Mordida de Nalga', desc: 'Permiso oficialmente concedido', icon: <IconHeart className="w-8 h-8 text-rose-600" />, terms: 'Expira en 1 año. Solo se usa 1 vez.' },
]

const REAL_PRIZES_2 = [
	{ id: 10, text: 'Te perdiste de un anillo de diamantes', sub: 'Para toda la vida', img: '/images/prize-ring.png' },
	{ id: 11, text: 'Te perdiste de un viaje a Paris', sub: 'La Ciudad del Amor', img: '/images/prize-paris.jpg' },
	{ id: 12, text: 'Te perdiste de un penthouse propio', sub: 'Solo pa ti', img: '/images/prize-penthouse.png' },
]

const RIBBON_COLORS6 = ['bg-violet-400', 'bg-pink-400', 'bg-amber-400', 'bg-teal-400', 'bg-rose-400', 'bg-indigo-400']
const RIBBON_COLORS11 = ['bg-violet-400', 'bg-pink-400', 'bg-amber-400', 'bg-emerald-400', 'bg-teal-400', 'bg-rose-400', 'bg-indigo-400', 'bg-cyan-400', 'bg-fuchsia-400', 'bg-yellow-400', 'bg-lime-400']

// ─── Coupon Card ─────────────────────────────────────────────────────────────
function CouponCard({ coupon }: { coupon: Coupon }) {
	const [isFlipped, setIsFlipped] = useState(false)

	return (
		<div
			className="relative w-full cursor-pointer select-none"
			style={{ perspective: '800px', aspectRatio: '3/2' }}
			onClick={() => setIsFlipped(f => !f)}
		>
			<motion.div
				animate={{ rotateY: isFlipped ? 180 : 0 }}
				transition={{ duration: 0.6, type: 'spring', stiffness: 220, damping: 22 }}
				style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
			>
				{/* Front */}
				<div
					style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
					className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl border-2 border-pink-300 shadow-xl flex flex-col items-center justify-center p-3 text-center overflow-hidden"
				>
					<div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
					<div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
					<div className="absolute left-6 right-6 top-1/3 border-t-2 border-dashed border-pink-200" />
					<div className="relative z-10 text-pink-600 mb-1">{coupon.icon}</div>
					<div className="relative z-10 mt-1">
						<h3 className="font-display font-bold text-pink-900 text-xs leading-tight">{coupon.title}</h3>
						<p className="text-[10px] text-pink-700/70 mt-0.5 leading-tight">{coupon.desc}</p>
					</div>
				</div>
				{/* Back */}
				<div
					style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
					className="bg-white rounded-2xl border-2 border-pink-100 shadow-xl flex flex-col items-center justify-center p-2 sm:p-3 text-center overflow-hidden"
				>
					<div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
					<div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
					<p className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-pink-400 mb-0.5 sm:mb-1">Términos</p>
					<p className="text-[7.5px] sm:text-[10px] text-slate-600 italic leading-tight sm:leading-snug px-1.5">{coupon.terms}</p>
					<div className="mt-1.5 sm:mt-2 bg-pink-50 border border-pink-200 text-pink-500 rounded-full px-1.5 sm:px-2 py-0.5 text-[6.5px] sm:text-[9px] font-mono">
						CUMPLE-{coupon.id.toString().padStart(3, '0')} · Solo TeFy
					</div>
				</div>
			</motion.div>
		</div>
	)
}

// ─── Gift Box ─────────────────────────────────────────────────────────────────
interface PrankItem { id: number; text: string; sub: string; icon: React.ReactNode }
interface RealItem1 { id: number; text: string; sub: string; img: string }
interface RealItem2 { id: number; text: string; sub: string; img: string }

function GiftBox1({ onClick, isSelected, revealed, selIdx, unselIdx, ribbonColor }: {
	onClick: () => void; isSelected: boolean; revealed: boolean
	selIdx: number; unselIdx: number; ribbonColor: string
}) {
	const prankItem: PrankItem | null = isSelected ? (PRANK_PRIZES[selIdx] ?? null) : null
	const realItem: RealItem1 | null = !isSelected && revealed ? (REAL_PRIZES_1[unselIdx] ?? null) : null

	return (
		<motion.div
			onClick={onClick}
			whileHover={!isSelected && !revealed ? { scale: 1.04, y: -4 } : {}}
			whileTap={!isSelected && !revealed ? { scale: 0.96 } : {}}
			className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer p-2 border-2 overflow-hidden transition-all duration-500 ${
				isSelected
					? 'bg-rose-500/10 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
					: realItem
						? 'bg-violet-500/10 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.35)] p-0'
						: 'bg-gradient-to-br from-rose-400/90 to-pink-600/90 border-rose-200 shadow-2xl'
			}`}
		>
			{/* Hidden gift box decoration */}
			{!prankItem && !realItem && (
				<>
					<div className={`absolute inset-x-0 top-0 h-1/4 ${ribbonColor} opacity-50`} />
					<div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[16%] ${ribbonColor} opacity-50`} />
					<div className="text-white/90"><IconGift /></div>
				</>
			)}

			{/* Prank revealed */}
			{prankItem && (
				<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="flex flex-col items-center text-center gap-1">
					{prankItem.icon}
					<p className="text-white text-[10px] font-bold leading-tight mt-1">{prankItem.text}</p>
					<p className="text-pink-200 text-[9px] leading-tight">{prankItem.sub}</p>
				</motion.div>
			)}

			{/* Real prize with image */}
			{realItem && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0">
					<img src={realItem.img} alt={realItem.text} className="w-full h-full object-cover" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent flex flex-col justify-end p-2 text-center pb-3">
						<p className="text-white font-bold text-[10px] leading-tight px-1">{realItem.text}</p>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}

function GiftBox2({ onClick, isSelected, revealed, selIdx, unselIdx, ribbonColor }: {
	onClick: () => void; isSelected: boolean; revealed: boolean
	selIdx: number; unselIdx: number; ribbonColor: string
}) {
	const couponItem: Coupon | null = isSelected ? (COUPONS[selIdx] ?? COUPONS[0]) : null
	const realItem: RealItem2 | null = !isSelected && revealed ? (REAL_PRIZES_2[unselIdx] ?? null) : null

	return (
		<motion.div
			onClick={onClick}
			whileHover={!isSelected && !revealed ? { scale: 1.04, y: -3 } : {}}
			whileTap={!isSelected && !revealed ? { scale: 0.96 } : {}}
			className={`relative aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer p-2 border-2 overflow-hidden transition-all duration-500 ${
				isSelected
					? 'bg-rose-500/10 border-rose-400'
					: realItem
						? 'bg-violet-500/10 border-violet-400 p-0'
						: 'bg-gradient-to-br from-rose-400/90 to-pink-600/90 border-rose-200 shadow-xl'
			}`}
		>
			{!couponItem && !realItem && (
				<>
					<div className={`absolute inset-x-0 top-0 h-1/4 ${ribbonColor} opacity-50`} />
					<div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[16%] ${ribbonColor} opacity-50`} />
					<div className="text-white/80">
						<IconGift />
					</div>
				</>
			)}
			{couponItem && (
				<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="flex flex-col items-center text-center gap-0.5">
					<div className="text-pink-300 transform scale-75">{couponItem.icon}</div>
					<p className="text-white text-[9px] font-bold leading-tight mt-1">{couponItem.title}</p>
					<p className="text-pink-200 text-[8px] leading-tight mt-0.5">{couponItem.desc}</p>
				</motion.div>
			)}
			{realItem && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0">
					<img src={realItem.img} alt={realItem.text} className="w-full h-full object-cover" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent flex flex-col justify-end p-2 text-center pb-2">
						<p className="text-white font-bold text-[9px] leading-tight px-0.5">{realItem.text}</p>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}

// ─── Runaway Yes Button ───────────────────────────────────────────────────────
function RunawayYesButton({ onEscape, attempts, onAttempt }: {
	onEscape: () => void; attempts: number; onAttempt: () => void
}) {
	const [pos, setPos] = useState({ top: '50%', left: '50%' })
	const escaped = attempts >= 7

	const flee = () => {
		if (escaped) return
		const top = Math.floor(Math.random() * 55 + 15) // 15%–70%
		const left = Math.floor(Math.random() * 60 + 15) // 15%–75%
		setPos({ top: `${top}%`, left: `${left}%` })
		onAttempt()
	}

	const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault()
		if (escaped) onEscape()
		else flee()
	}

	return (
		<motion.button
			animate={{ top: pos.top, left: pos.left }}
			transition={{ type: 'spring', stiffness: 260, damping: 22 }}
			style={{ position: 'fixed', transform: 'translate(-50%, -50%)', zIndex: 9999, touchAction: 'none' }}
			onClick={handlePress}
			onTouchEnd={handlePress}
			className={`py-4 px-10 rounded-full font-bold text-2xl select-none transition-shadow ${
				escaped
					? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_0_35px_rgba(16,185,129,0.8)]'
					: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
			}`}
		>
			SÍ
		</motion.button>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BirthdayFlow() {
	const [state, setState] = useState(0)
	const [pin, setPin] = useState('')
	const [pinError, setPinError] = useState(false)

	// State 1
	const [selectedGifts1, setSelectedGifts1] = useState<number[]>([])
	const [revealed1, setRevealed1] = useState(false)

	// State 3 (second gift round - 11 boxes)
	const [selectedGifts2, setSelectedGifts2] = useState<number[]>([])
	const [revealed2, setRevealed2] = useState(false)

	// Runaway states
	const [attempts2, setAttempts2] = useState(0)
	const [noScale2, setNoScale2] = useState(1)

	// State 6
	const [isSaving, setIsSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [saveError, setSaveError] = useState('')

	const unselectedIdx1 = Array.from({ length: 6 }, (_, i) => i).filter(i => !selectedGifts1.includes(i))
	const unselectedIdx2 = Array.from({ length: 11 }, (_, i) => i).filter(i => !selectedGifts2.includes(i))

	const handlePinSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const clean = pin.replace(/\s/g, '')
		if (clean === '3186' || clean.toLowerCase() === 'tefy') {
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
		if (selectedGifts2.length >= 8 || selectedGifts2.includes(i)) return
		const next = [...selectedGifts2, i]
		setSelectedGifts2(next)
		if (next.length === 8) setTimeout(() => setRevealed2(true), 1200)
	}

	const handleSave = async () => {
		setIsSaving(true)
		setSaveError('')
		try {
			const res = await fetch('/api/coupons/save', { method: 'POST' })
			if (!res.ok) {
				const d = await res.json().catch(() => ({}))
				setSaveError((d as { error?: string }).error ?? 'Error al guardar')
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

	// ─── State 0: PIN ──────────────────────────────────────────────────────────
	if (state === 0) {
		return (
			<div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-rose-950/30 to-slate-950 flex items-center justify-center p-6">
				<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
					<div className="text-center mb-8">
						<div className="w-20 h-20 mx-auto bg-gradient-to-tr from-rose-600 to-pink-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] mb-5 rotate-3">
							<IconLock />
						</div>
						<h1 className="font-display text-3xl font-bold text-white mb-2">Sorpresa Secreta</h1>
						<p className="text-white/50 text-sm">Ingresa el codigo para acceder</p>
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
								Codigo incorrecto
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

					{/* ─── State 1: First Gift Round ─── */}
					{state === 1 && (
						<motion.div key="gifts1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-xl text-center">
							<p className="text-pink-400 text-sm font-mono uppercase tracking-widest mb-2">Feliz Cumpleanos</p>
							<h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Elige tus 3 regalos</h2>
							<p className="text-white/50 text-sm mb-8">Selecciona 3 cajas. Lo que escojas es tuyo.</p>
							<div className="grid grid-cols-3 gap-3 mb-6">
								{Array.from({ length: 6 }).map((_, i) => {
									const selIdx = selectedGifts1.indexOf(i)
									const unselIdx = unselectedIdx1.indexOf(i)
									return (
										<GiftBox1
											key={i}
											onClick={() => handleGift1Click(i)}
											isSelected={selectedGifts1.includes(i)}
											revealed={revealed1}
											selIdx={selIdx}
											unselIdx={unselIdx}
											ribbonColor={RIBBON_COLORS6[i]}
										/>
									)
								})}
							</div>
							<AnimatePresence>
								{revealed1 && (
									<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
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
							<h2 className="font-display text-3xl font-bold text-white mb-10">¿Quieres otra oportunidad para recibir más regalos?</h2>
							<div className="flex justify-center">
								<motion.button
									animate={{ scale: noScale2 }}
									onClick={() => setNoScale2(s => s * 1.1)}
									className="py-3 px-10 rounded-full bg-slate-800 border border-slate-600 text-white font-bold text-lg active:scale-95"
								>
									NO
								</motion.button>
							</div>
							<RunawayYesButton
								attempts={attempts2}
								onAttempt={() => setAttempts2(a => a + 1)}
								onEscape={() => setState(3)}
							/>
						</motion.div>
					)}

					{/* ─── State 3: Second Gift Round (11 boxes) ─── */}
					{state === 3 && (
						<motion.div key="gifts2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-xl text-center">
							<p className="text-pink-400 text-sm font-mono uppercase tracking-widest mb-2">Segunda oportunidad</p>
							<h2 className="font-display text-3xl font-bold text-white mb-2">Elige 8 regalos</h2>
							<p className="text-white/50 text-sm mb-8">Esta vez son 11 cajas. Elige rápido.</p>
							<div className="grid grid-cols-3 sm:grid-cols-4 gap-2 lg:gap-3 mb-6">
								{Array.from({ length: 11 }).map((_, i) => {
									const selIdx = selectedGifts2.indexOf(i)
									const unselIdx = unselectedIdx2.indexOf(i)
									return (
										<GiftBox2
											key={i}
											onClick={() => handleGift2Click(i)}
											isSelected={selectedGifts2.includes(i)}
											revealed={revealed2}
											selIdx={selIdx}
											unselIdx={unselIdx}
											ribbonColor={RIBBON_COLORS11[i]}
										/>
									)
								})}
							</div>
							<AnimatePresence>
								{revealed2 && (
									<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
										<motion.button onClick={() => setState(5)} whileTap={{ scale: 0.95 }} className="mt-4 py-3 px-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_0_25px_rgba(236,72,153,0.4)]">
											Ver cupones obtenidos
										</motion.button>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					)}

					{/* ─── State 5: All Coupons ─── */}
					{state === 5 && (
						<motion.div key="coupons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-2xl text-center">
							<p className="text-pink-400 text-sm font-mono uppercase tracking-widest mb-2">Tus regalos de verdad</p>
							<h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Cupones Obtenidos</h2>
							<p className="text-white/50 text-sm mb-8">Disfrútalos, te los mereces.</p>
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
										Estos 8 cupones quedaran asociados a tu cuenta <span className="text-pink-400 font-semibold">TeFy</span> para siempre.
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
									<p className="text-white/30 text-xs text-center mb-6">Puedes revisarlos en el panel de administracion</p>
									<Link href="/cumpleanera/carta" className="w-full py-4 rounded-xl bg-white text-pink-600 font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform hover:scale-105 text-lg">
										Continuar a mi carta
									</Link>
								</motion.div>
							)}
						</motion.div>
					)}

				</AnimatePresence>
			</div>
		</div>
	)
}
