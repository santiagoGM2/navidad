'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerVibration } from '@/utils/vibration'

const MAX_SIZE = 1200
const QUALITY = 0.85

function compressImage(file: File): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		const url = URL.createObjectURL(file)
		img.onload = () => {
			URL.revokeObjectURL(url)
			const canvas = document.createElement('canvas')
			let { width, height } = img
			if (width > MAX_SIZE || height > MAX_SIZE) {
				if (width > height) {
					height = Math.round((height * MAX_SIZE) / width)
					width = MAX_SIZE
				} else {
					width = Math.round((width * MAX_SIZE) / height)
					height = MAX_SIZE
				}
			}
			canvas.width = width
			canvas.height = height
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				reject(new Error('Canvas not supported'))
				return
			}
			ctx.drawImage(img, 0, 0, width, height)
			canvas.toBlob(
				(blob) => (blob ? resolve(blob) : reject(new Error('Compress failed'))),
				'image/jpeg',
				QUALITY
			)
		}
		img.onerror = () => {
			URL.revokeObjectURL(url)
			reject(new Error('Image load failed'))
		}
		img.src = url
	})
}

export default function SubirFotoForm() {
	const [file, setFile] = useState<File | null>(null)
	const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
	const [loading, setLoading] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const cameraRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (status.type) {
			const t = setTimeout(() => setStatus({ type: null, message: '' }), 6000)
			return () => clearTimeout(t)
		}
	}, [status.type])

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		setStatus({ type: null, message: '' })
		if (!f) {
			setFile(null)
			setPreview(null)
			return
		}

		if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
			setStatus({ type: 'error', message: 'Sólo se permiten imágenes o videos.' })
			return
		}
		setFile(f)
		setPreview(URL.createObjectURL(f))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!file) return

		setStatus({ type: null, message: '' })
		setLoading(true)
		try {
			let uploadFile: File | Blob = file
			if (file.type.startsWith('image/')) {
				uploadFile = await compressImage(file)
			}

			const formData = new FormData()
			formData.append('file', uploadFile, file.name)

			const res = await fetch('/api/collage/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error(data.error || data.details || 'Error al subir')
			}

			triggerVibration(100)
			setStatus({ type: 'success', message: '¡Recuerdo subido al collage correctamente!' })
			setFile(null)
			setPreview(null)
			if (inputRef.current) inputRef.current.value = ''
			if (cameraRef.current) cameraRef.current.value = ''
		} catch (err) {
			setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Error de conexión' })
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="relative">
			<AnimatePresence>
				{status.type && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: -20, x: '-50%' }}
						animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
						exit={{ opacity: 0, scale: 0.9, y: -10 }}
						className={`fixed top-4 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border min-w-[320px] text-center ${status.type === 'success'
							? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
							: 'bg-rose-500/20 border-rose-500/30 text-rose-200'
							}`}
					>
						<p className="text-sm font-semibold">{status.message}</p>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl"
			>
				<form onSubmit={handleSubmit} className="space-y-8">
					<div className="text-center space-y-2">
						<h2 className="text-white text-xl font-bold">Publicar Recuerdo</h2>
						<p className="text-white/40 text-sm">Todo se publica directamente en el collage público.</p>
					</div>

					<div className="flex flex-col items-center">
						<div
							onClick={() => !loading && inputRef.current?.click()}
							className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/5 transition-all cursor-pointer overflow-hidden group"
						>
							{preview ? (
								file?.type.startsWith('image/') ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={preview} alt="Preview" className="w-full h-full object-cover" />
								) : (
									<video src={preview} className="w-full h-full object-cover" muted />
								)
							) : (
								<div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
									<svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<span className="text-sm font-medium">Click para seleccionar archivo</span>
								</div>
							)}
							{preview && (
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<span className="text-white text-sm font-bold">Cambiar archivo</span>
								</div>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<button
							type="button"
							disabled={loading}
							onClick={() => cameraRef.current?.click()}
							className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 font-bold disabled:opacity-50"
						>
							<svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Cámara
						</button>
						<button
							type="button"
							disabled={loading}
							onClick={() => inputRef.current?.click()}
							className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 font-bold disabled:opacity-50"
						>
							<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							Galería
						</button>
					</div>

					<input
						ref={inputRef}
						type="file"
						accept="image/*,video/*"
						onChange={onFileChange}
						className="hidden"
					/>
					<input
						ref={cameraRef}
						type="file"
						accept="image/*"
						capture="environment"
						onChange={onFileChange}
						className="hidden"
					/>

					<button
						type="submit"
						disabled={!file || loading}
						className="w-full py-5 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-xl shadow-pink-600/20 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
					>
						{loading ? (
							<>
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Subiendo...</span>
							</>
						) : (
							<>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
								</svg>
								<span>Publicar Recuerdo</span>
							</>
						)}
					</button>
				</form>
			</motion.div>
		</div>
	)
}
