'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MOMENTS } from '@/constants'

export default function MomentosPage() {
	return (
		<main className="min-h-screen py-20 px-4">
			<div className="max-w-4xl mx-auto">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center"
				>
					Momentos
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-16 text-center"
				>
					Frases, pensamientos y detalles que viven en mi corazón
				</motion.p>

				<div className="space-y-12 md:space-y-16">
					{MOMENTS.map((moment, index) => (
						<MomentBubble key={moment.id} moment={moment} index={index} />
					))}
				</div>
			</div>
		</main>
	)
}

function MomentBubble({ moment, index }: { moment: typeof MOMENTS[number]; index: number }) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-100px' })

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 50, x: 30 }}
			animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 50, x: 30 }}
			transition={{
				duration: 0.8,
				delay: index * 0.2,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
			className="flex justify-center"
		>
			<motion.div
				whileHover={{ scale: 1.05 }}
				className="glass-subtle rounded-full px-8 py-5 md:px-10 md:py-6 inline-block max-w-md"
			>
				<p className="font-display text-lg md:text-xl text-slate-800 text-center italic">
					&ldquo;{moment.text}&rdquo;
				</p>
			</motion.div>
		</motion.div>
	)
}


