'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { DailyMemoryRow } from './RecuerdosGrid'
import { triggerVibration } from '@/utils/vibration'

export default function RecapSlideshow({
	memories,
	year,
}: {
	memories: DailyMemoryRow[]
	year: number
}) {
	const [index, setIndex] = useState(0)
	const [playing, setPlaying] = useState(true)

	const next = useCallback(() => {
		setIndex((i) => (i + 1) % memories.length)
	}, [memories.length])

	useEffect(() => {
		if (!playing || memories.length <= 1) return
		const t = setInterval(next, 3500)
		return () => clearInterval(t)
	}, [playing, next, memories.length])

	useEffect(() => {
		if (index === 0 && memories.length) {
			triggerVibration(50)
		}
	}, [index, memories.length])

	const current = memories[index]

	return (
		<div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/15 aspect-[4/3] max-h-[70vh]">
			<AnimatePresence mode="wait">
				{current && (
					<motion.div
						key={current.id}
						initial={{ opacity: 0, scale: 1.05 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.98 }}
						transition={{ duration: 1.2, ease: 'easeInOut' }}
						className="absolute inset-0"
					>
						<Image
							src={current.image_url}
							alt={current.description || `Recuerdo ${index + 1}`}
							fill
							className="object-contain"
							sizes="90vw"
							priority={index < 3}
							unoptimized={current.image_url.startsWith('http') && new URL(current.image_url).hostname.includes('supabase')}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
					</motion.div>
				)}
			</AnimatePresence>
			<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
				<span className="text-white/90 text-sm">
					{index + 1} / {memories.length}
				</span>
				<button
					type="button"
					onClick={() => setPlaying((p) => !p)}
					className="text-white/80 hover:text-white text-sm"
				>
					{playing ? 'Pausar' : 'Reproducir'}
				</button>
			</div>
			<div className="absolute top-4 left-4 right-4 text-center">
				<motion.span
					key={year}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-white/90 font-display text-lg drop-shadow-lg"
				>
					Nuestro año juntos · {year}
				</motion.span>
			</div>
		</div>
	)
}
