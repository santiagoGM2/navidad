'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
}

export default function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar'
}: ConfirmDialogProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
					/>
					<div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: 'spring', duration: 0.5 }}
							className="w-full max-w-md"
						>
							<div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/20 rounded-2xl shadow-2xl p-6">
								<h3 className="text-white font-display text-xl font-semibold mb-3">{title}</h3>
								<p className="text-white/80 text-sm leading-relaxed mb-6">{message}</p>
								<div className="flex gap-3">
									<motion.button
										onClick={onClose}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all"
									>
										{cancelText}
									</motion.button>
									<motion.button
										onClick={() => {
											onConfirm()
											onClose()
										}}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 rounded-lg text-white font-medium transition-all shadow-lg"
									>
										{confirmText}
									</motion.button>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}
