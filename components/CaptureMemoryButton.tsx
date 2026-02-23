'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface CollageRecuerdo {
	id: string
	url: string
	fecha_subida: string
	tipo: 'foto' | 'video'
	usuario_subio: string
	file_path?: string
}

interface CaptureMemoryButtonProps {
	onRecuerdoSubido?: (recuerdo: CollageRecuerdo) => void
}

export default function CaptureMemoryButton({ onRecuerdoSubido }: CaptureMemoryButtonProps) {
	const [isAdmin, setIsAdmin] = useState(false)
	const [showPanel, setShowPanel] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const cameraInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		checkSession()
		const handleAuthChange = () => checkSession()
		window.addEventListener('auth-change', handleAuthChange)
		return () => window.removeEventListener('auth-change', handleAuthChange)
	}, [])

	const checkSession = async () => {
		try {
			const res = await fetch('/api/auth/session')
			if (res.ok) {
				const data = await res.json()
				const adminUsers = ['santi', 'tefy']
				setIsAdmin(adminUsers.includes(data.user?.toLowerCase()))
			} else {
				setIsAdmin(false)
			}
		} catch {
			setIsAdmin(false)
		}
	}

	const handleFileUpload = useCallback(async (file: File) => {
		if (!file) return

		const isVideo = file.type.startsWith('video/')
		const isImage = file.type.startsWith('image/')

		if (!isImage && !isVideo) {
			setMessage({ type: 'error', text: 'Solo imágenes o videos' })
			return
		}

		const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
		if (file.size > maxSize) {
			setMessage({ type: 'error', text: `Archivo muy grande (máx ${isVideo ? '100MB' : '10MB'})` })
			return
		}

		setUploading(true)
		setMessage(null)

		try {
			const formData = new FormData()
			formData.append('file', file)

			const res = await fetch('/api/collage/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.details || data.error || 'Error al subir')
			}

			setMessage({ type: 'success', text: '¡Recuerdo subido al Collage!' })
			setShowPanel(false)

			if (data.recuerdo && onRecuerdoSubido) {
				onRecuerdoSubido(data.recuerdo)
			}

			if (typeof navigator !== 'undefined' && navigator.vibrate) {
				navigator.vibrate(100)
			}

			setTimeout(() => setMessage(null), 4000)
		} catch (err) {
			setMessage({
				type: 'error',
				text: err instanceof Error ? err.message : 'Error al subir'
			})
		} finally {
			setUploading(false)
			if (fileInputRef.current) fileInputRef.current.value = ''
			if (cameraInputRef.current) cameraInputRef.current.value = ''
		}
	}, [onRecuerdoSubido])

	if (!isAdmin) return null

	return (
		<>
			{/* Floating upload button */}
			<motion.button
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.5, type: 'spring' }}
				onClick={() => setShowPanel(!showPanel)}
				className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 shadow-2xl shadow-violet-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				aria-label="Subir recuerdo"
			>
				<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
				</svg>
			</motion.button>

			{/* Upload panel */}
			<AnimatePresence>
				{showPanel && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowPanel(false)}
							className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 20, scale: 0.95 }}
							className="fixed bottom-24 right-6 z-[60] w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
						>
							<h3 className="font-display text-lg font-bold text-white mb-1">
								Subir Recuerdo
							</h3>
							<p className="text-white/60 text-xs mb-5">
								Se publicará directamente en el Collage
							</p>

							<div className="space-y-3">
								<button
									onClick={() => cameraInputRef.current?.click()}
									disabled={uploading}
									className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 hover:from-violet-500/30 hover:to-pink-500/30 border border-white/10 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-3"
								>
									<svg className="w-5 h-5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									Tomar foto con cámara
								</button>

								<button
									onClick={() => fileInputRef.current?.click()}
									disabled={uploading}
									className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-white/10 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-3"
								>
									<svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									Subir desde galería
								</button>
							</div>

							{uploading && (
								<div className="mt-5">
									<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
										<motion.div
											className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
											initial={{ width: '0%' }}
											animate={{ width: '100%' }}
											transition={{ duration: 2, repeat: Infinity }}
										/>
									</div>
									<p className="text-white/70 text-xs text-center mt-2.5">
										Subiendo al Collage...
									</p>
								</div>
							)}
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Toast message */}
			<AnimatePresence>
				{message && (
					<motion.div
						initial={{ opacity: 0, y: 50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.9 }}
						className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm text-center ${message.type === 'success'
							? 'bg-emerald-500/90 text-white border border-emerald-300/30'
							: 'bg-rose-500/90 text-white border border-rose-300/30'
							}`}
					>
						<p className="font-medium text-sm">{message.text}</p>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Hidden file inputs */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,video/*"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) handleFileUpload(file)
				}}
			/>
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*,video/*"
				capture="environment"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) handleFileUpload(file)
				}}
			/>
		</>
	)
}
