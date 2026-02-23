'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
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
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const cameraRef = useRef<HTMLInputElement>(null)

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		setError('')
		setSuccess('')
		if (!f) {
			setFile(null)
			setPreview(null)
			return
		}

		const isImage = f.type.startsWith('image/')
		const isVideo = f.type.startsWith('video/')

		if (!isImage && !isVideo) {
			setError('Solo se permiten imágenes o videos.')
			return
		}
		setFile(f)
		setPreview(URL.createObjectURL(f))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!file) {
			setError('Selecciona una imagen o video.')
			return
		}
		setError('')
		setSuccess('')
		setLoading(true)
		try {
			let uploadFile: File | Blob = file
			if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
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
				setError(data.error || data.details || 'Error al subir')
				return
			}
			triggerVibration(100)
			setSuccess('¡Recuerdo subido al Collage exitosamente! 💜')
			setFile(null)
			setPreview(null)
			if (inputRef.current) inputRef.current.value = ''
			if (cameraRef.current) cameraRef.current.value = ''
		} catch {
			setError('Error de conexión')
		} finally {
			setLoading(false)
		}
	}

	return (
		<motion.form
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 space-y-6"
			onSubmit={handleSubmit}
		>
			<div className="text-center mb-2">
				<p className="text-white/60 text-sm">
					Todo recuerdo se publica directamente en el Collage público.
				</p>
			</div>

			{/* Upload options */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<button
					type="button"
					onClick={() => cameraRef.current?.click()}
					className="py-4 px-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 hover:from-violet-500/30 hover:to-pink-500/30 border border-white/10 text-white text-sm font-medium transition-all flex items-center justify-center gap-3"
				>
					<svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					📷 Tomar foto
				</button>

				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="py-4 px-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-white/10 text-white text-sm font-medium transition-all flex items-center justify-center gap-3"
				>
					<svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					🖼 Subir archivo
				</button>
			</div>

			{/* Hidden inputs */}
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
				accept="image/*,video/*"
				capture="environment"
				onChange={onFileChange}
				className="hidden"
			/>

			{/* Preview */}
			{preview && file && (
				<div className="relative rounded-xl overflow-hidden max-w-sm mx-auto bg-white/5 border border-white/10">
					{file.type.startsWith('video/') ? (
						<video src={preview} className="w-full max-h-64 object-contain" controls muted />
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={preview} alt="Vista previa" className="w-full max-h-64 object-contain" />
					)}
					<button
						type="button"
						onClick={() => {
							setFile(null)
							setPreview(null)
							if (inputRef.current) inputRef.current.value = ''
							if (cameraRef.current) cameraRef.current.value = ''
						}}
						className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			)}

			{error && (
				<p className="text-sm text-rose-300 bg-rose-500/20 rounded-lg px-3 py-2">
					{error}
				</p>
			)}

			{success && (
				<p className="text-sm text-emerald-300 bg-emerald-500/20 rounded-lg px-3 py-2">
					{success}
				</p>
			)}

			<button
				type="submit"
				disabled={loading || !file}
				className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-violet-400/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
			>
				{loading ? 'Subiendo al Collage...' : 'Subir Recuerdo'}
			</button>
		</motion.form>
	)
}
