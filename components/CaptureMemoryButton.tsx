'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CaptureMemoryButton() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [showPanel, setShowPanel] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const cameraInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		checkSession()
	}, [])

	const checkSession = async () => {
		try {
			const res = await fetch('/api/auth/session')
			setIsLoggedIn(res.ok)
		} catch {
			setIsLoggedIn(false)
		}
	}

	const handleFileUpload = async (file: File) => {
		if (!file) return

		// Validar tipo
		if (!file.type.startsWith('image/')) {
			setMessage({ type: 'error', text: 'Solo se permiten imágenes' })
			return
		}

		// Validar tamaño (5MB)
		if (file.size > 5 * 1024 * 1024) {
			setMessage({ type: 'error', text: 'La imagen es muy grande (máx 5MB)' })
			return
		}

		setUploading(true)
		setMessage(null)

		try {
			const formData = new FormData()
			formData.append('file', file)

			const res = await fetch('/api/memories/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Error al subir')
			}

			setMessage({ type: 'success', text: '¡Momento capturado! 💕' })
			setShowPanel(false)
			
			// Limpiar mensaje después de 3s
			setTimeout(() => setMessage(null), 3000)
		} catch (err) {
			setMessage({ 
				type: 'error', 
				text: err instanceof Error ? err.message : 'Error al subir la foto' 
			})
		} finally {
			setUploading(false)
		}
	}

	if (!isLoggedIn) return null

	return (
		<>
			{/* Botón flotante */}
			<motion.button
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.5, type: 'spring' }}
				onClick={() => setShowPanel(!showPanel)}
				className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-2xl shadow-pink-500/50 flex items-center justify-center text-white hover:scale-110 transition-transform"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
			>
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</motion.button>

			{/* Panel de opciones */}
			<AnimatePresence>
				{showPanel && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="fixed bottom-24 right-6 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
					>
						<h3 className="font-display text-lg font-bold text-white mb-3">
							Capturar momento
						</h3>
						
						<div className="space-y-2">
							<button
								onClick={() => cameraInputRef.current?.click()}
								disabled={uploading}
								className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-3"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								</svg>
								Tomar foto
							</button>

							<button
								onClick={() => fileInputRef.current?.click()}
								disabled={uploading}
								className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-3"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								Subir desde galería
							</button>
						</div>

						{uploading && (
							<p className="text-white/70 text-xs text-center mt-3">
								Subiendo...
							</p>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Toast de mensaje */}
			<AnimatePresence>
				{message && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className={`fixed bottom-6 left-6 z-50 px-6 py-4 rounded-xl shadow-2xl ${
							message.type === 'success'
								? 'bg-emerald-500/90 text-white'
								: 'bg-rose-500/90 text-white'
						}`}
					>
						{message.text}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Inputs ocultos */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) handleFileUpload(file)
				}}
			/>
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*"
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
