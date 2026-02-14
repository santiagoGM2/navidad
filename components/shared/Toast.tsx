'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ToastProps {
	isOpen: boolean
	onClose: () => void
	title: string
	message?: string
	type?: 'success' | 'error' | 'info'
}

export default function Toast({ isOpen, onClose, title, message, type = 'success' }: ToastProps) {
	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(onClose, 3000)
			return () => clearTimeout(timer)
		}
	}, [isOpen, onClose])

	const colors = {
		success: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
		error: 'from-red-500/20 to-rose-500/20 border-red-500/30',
		info: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30'
	}

	const icons = {
		success: (
			<svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
			</svg>
		),
		error: (
			<svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
			</svg>
		),
		info: (
			<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		)
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
					/>
					<div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: 'spring', duration: 0.5 }}
							className="pointer-events-auto w-full max-w-sm"
						>
							<div className={`backdrop-blur-xl bg-gradient-to-br ${colors[type]} border rounded-2xl shadow-2xl p-6`}>
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
										{icons[type]}
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
										{message && <p className="text-white/80 text-sm leading-relaxed">{message}</p>}
									</div>
								</div>
								<motion.button
									onClick={onClose}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full mt-4 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all"
								>
									OK
								</motion.button>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}
