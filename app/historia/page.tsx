'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TIMELINE_MILESTONES, RELATIONSHIP_START_DATE } from '@/constants'
import TimeCounter from '@/components/TimeCounter'

// Iconos SVG para reemplazar emojis
const TimelineIcons: Record<string, JSX.Element> = {
	'message': (
		<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
			<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
		</svg>
	),
	'coffee': (
		<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
			<path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3z" />
		</svg>
	),
	'heart': (
		<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
			<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
		</svg>
	),
	'wave': (
		<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
			<path d="M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8z" />
		</svg>
	),
	'plane': (
		<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
			<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
		</svg>
	),
}

const getIconForMilestone = (id: string): JSX.Element => {
	switch (id) {
		case 'first-message': return TimelineIcons['message']
		case 'first-date': return TimelineIcons['coffee']
		case 'fell-in-love': return TimelineIcons['heart']
		case 'relationship-start': return TimelineIcons['wave']
		case 'first-trip': return TimelineIcons['plane']
		default: return TimelineIcons['heart']
	}
}

export default function HistoriaPage() {
	return (
		<main className="min-h-screen py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					className="font-display text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg"
				>
					Nuestra Historia
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 text-center"
				>
					Un viaje a traves de los momentos que han definido nuestro amor
				</motion.p>

				{/* Contador de tiempo */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4 }}
					className="mb-20"
				>
					<TimeCounter />
				</motion.div>

				{/* Linea de tiempo */}
				<div className="relative">
					{/* Linea vertical */}
					<div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-300/50 via-blue-400/50 to-blue-600/50 -translate-x-1/2 rounded-full" />

					<div className="relative space-y-20 md:space-y-32">
						{TIMELINE_MILESTONES.map((milestone, index) => (
							<TimelineItem
								key={milestone.id}
								milestone={milestone}
								index={index}
								isLast={index === TIMELINE_MILESTONES.length - 1}
							/>
						))}
					</div>
				</div>
			</div>
		</main>
	)
}

function TimelineItem({
	milestone,
	index,
	isLast,
}: {
	milestone: typeof TIMELINE_MILESTONES[number]
	index: number
	isLast: boolean
}) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-150px' })
	const isEven = index % 2 === 0

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8, delay: index * 0.2 }}
			className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-12 ${isEven ? 'md:flex-row-reverse' : ''
				}`}
		>
			{/* Contenido */}
			<motion.div
				whileHover={{ scale: 1.02 }}
				className={`flex-1 w-full md:w-auto ${isEven ? 'md:text-right' : 'md:text-left'
					}`}
			>
				<div className="glass-strong rounded-2xl p-6 md:p-8">
					<div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : 'md:justify-start'
						}`}>
						<div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
							{getIconForMilestone(milestone.id)}
						</div>
						<span className="text-sm font-medium text-ocean-deep">
							{new Date(milestone.date).toLocaleDateString('es-ES', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</span>
					</div>
					<h3 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
						{milestone.title}
					</h3>
					<p className="text-slate-600 leading-relaxed">{milestone.description}</p>
				</div>
			</motion.div>

			{/* Punto central */}
			<div className="relative z-10 flex-shrink-0">
				<motion.div
					whileHover={{ scale: 1.3 }}
					className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-4 border-white shadow-lg"
				/>
			</div>

			{/* Imagen placeholder */}
			<motion.div
				whileHover={{ scale: 1.05 }}
				className="flex-1 w-full md:w-80 h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl"
			>
				<div className="w-full h-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 backdrop-blur-sm flex items-center justify-center">
					<div className="text-cyan-600/60 w-16 h-16">
						{getIconForMilestone(milestone.id)}
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}
