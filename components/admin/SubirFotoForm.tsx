'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [description, setDescription] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		setError('')
		if (!f) {
			setFile(null)
			setPreview(null)
			return
		}
		if (!f.type.startsWith('image/')) {
			setError('Elegí una imagen (JPEG, PNG o WebP).')
			return
		}
		setFile(f)
		setPreview(URL.createObjectURL(f))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!file) {
			setError('Elegí una imagen.')
			return
		}
		setError('')
		setLoading(true)
		try {
			let blob: Blob = file
			if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
				blob = await compressImage(file)
			}
			const formData = new FormData()
			formData.append('file', blob, file.name)
			if (description.trim()) formData.append('description', description.trim())

			const res = await fetch('/api/admin/upload-daily', {
				method: 'POST',
				body: formData,
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				setError(data.error || 'Error al subir')
				return
			}
			triggerVibration(100)
			router.refresh()
			setFile(null)
			setPreview(null)
			setDescription('')
			if (inputRef.current) inputRef.current.value = ''
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
			<div>
				<label className="block text-sm font-medium text-white/90 mb-2">
					Imagen del día
				</label>
				<input
					ref={inputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					onChange={onFileChange}
					className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white file:font-medium"
				/>
				{preview && (
					<div className="mt-4 relative rounded-xl overflow-hidden max-w-xs aspect-video bg-white/5">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
					</div>
				)}
			</div>
			<div>
				<label htmlFor="desc" className="block text-sm font-medium text-white/90 mb-2">
					Descripción (opcional)
				</label>
				<input
					id="desc"
					type="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Un momento especial..."
					className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
				/>
			</div>
			{error && (
				<p className="text-sm text-rose-300 bg-rose-500/20 rounded-lg px-3 py-2">
					{error}
				</p>
			)}
			<button
				type="submit"
				disabled={loading || !file}
				className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
			>
				{loading ? 'Subiendo...' : 'Guardar momento'}
			</button>
		</motion.form>
	)
}
