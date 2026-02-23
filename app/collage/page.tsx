'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ConstellationBackground from '@/components/ConstellationBackground'
import BackButton from '@/components/BackButton'
import CaptureMemoryButton, { type CollageRecuerdo } from '@/components/CaptureMemoryButton'

const LOCAL_MEDIA_FILES = [
	'cumpleaños.jpeg', 'fiesta 15.jpeg', 'halloween.jpeg', 'halloween2.jpeg',
	'invitacion especial.jpeg', 'lagocalima.jpeg', 'noviazgo.jpg', 'lp_image.jpg',
	'IMG_0390.jpg', 'IMG_0749.jpg', 'IMG_0751.jpg', 'IMG_0781.jpg', 'IMG_0816.jpg',
	'IMG_0821.jpg', 'IMG_0855.jpg', 'IMG_0856.jpg', 'IMG_0863.jpg', 'IMG_0874.jpg',
	'IMG_1125.jpg', 'IMG_1463.jpg', 'IMG_1553.jpg', 'IMG_1555.jpg', 'IMG_2284.jpg',
	'IMG_2477.jpg', 'IMG_2796.jpg', 'IMG_2875.jpg', 'IMG_2877.jpg', 'IMG_2882.jpg',
	'IMG_3160.jpg', 'IMG_3182.jpg', 'IMG_3183.jpg', 'IMG_3213.jpg', 'IMG_3214.jpg',
	'IMG_3226.jpg', 'IMG_3257.jpg', 'IMG_3289.jpg', 'IMG_3296.jpg', 'IMG_3464.jpg',
	'IMG_3467.jpg', 'IMG_3779.jpg', 'IMG_3986.jpg', 'IMG_4003.jpg', 'IMG_4005.jpg',
	'IMG_4179.jpg', 'IMG_4414.jpg', 'IMG_4477.jpg', 'IMG_4533.jpg', 'IMG_5023.jpg',
	'IMG_5091.jpg', 'IMG_5165.jpg', 'IMG_5293.jpg', 'IMG_5306.jpg', 'IMG_5636.jpg',
	'IMG_5917.jpg', 'IMG_5927.jpg', 'IMG_6084.jpg', 'IMG_6087.jpg', 'IMG_6095.jpg',
	'IMG_6100.jpg', 'IMG_6333.jpg', 'IMG_6581.jpg', 'IMG_6587.jpg', 'IMG_7995.jpg',
	'IMG_8490.jpg', 'IMG_9060.jpg', 'IMG_9255.jpg', 'IMG_9395.jpg', 'IMG_9589.jpg',
	'IMG_9718.jpg', 'IMG_9731.jpg', 'IMG_9800.jpg', 'IMG_9927.jpg', 'IMG_9940.jpg',
	'0211B0E4-3B72-4ACB-B44A-A36D95B96D56.JPG', '0ADC408C-3C53-4AE4-91AA-BEBCA58B0EFC.JPG',
	'12C1C17B-B62E-40CE-924A-C19A170C1D1E.JPG', '2AE0694E-EB05-48D6-A773-ED9061DCBE59.JPG',
	'34842C8F-9BEB-4254-B5FF-80E0589B46AF.JPG', '35275508-BA2C-40B2-BD1D-A4B5D6653C36.JPG',
	'3A0D2D3C-7A2B-4D79-9F17-B361FD272294.JPG', '412005BA-32B6-4D0A-BB11-1D2634BC33E6.JPG',
	'48fe7811-7942-4346-b1c7-24ea1d7e7821.JPG', '4D711B1A-C190-40A0-B016-0C91DFA62367.JPG',
	'552C0AEE-5BC4-4D2D-A6B2-E2830192F1AD.JPG', '69D53A13-D10A-42B4-AF94-6AC7600006A3.JPG',
	'6c1b9754-b5d6-4e80-a00e-8422bcde5f77.JPG', '79271116-FCD8-43FE-9128-484A4BA0FC20.JPG',
	'7ABE0C21-647B-49FC-89DB-090AE030D602.JPG', '8209CABD-58A5-494B-BF0B-D55985912CD7.JPG',
	'822cea0c-708b-41b7-a389-705160aef8af.JPG', '9B446D33-E159-46F5-85EA-1A603EE9634C.JPG',
	'A40B92B6-09FA-463A-AA31-1073261DC20F.JPG', 'bc2b5cea-b0a1-4db1-96f5-1f333d982cfd.JPG',
	'BC8F5386-ECA1-4F49-988A-6996732C9300.JPG', 'BC9C06DA-EDD0-4E2C-96FA-81697762BFC6.JPG',
	'BF9E7FE5-1054-425E-81FF-FF8FCB4C3B9D.JPG', 'C39DE8F1-940B-4ACA-ADA3-B249E17A497C.JPG',
	'DD5D08B7-F6AD-4AB7-B61E-9E7E9550B3C1.JPG', 'E87B4D8E-434F-4936-8FD1-48FB8D726EFA.JPG',
	'e8e5a79f-f095-4503-8703-ef226c160cf4.JPG', 'f04bdaa0-a21c-4992-825a-aa9ea087423f.JPG',
	'f0c71440-6bc1-4fc4-8489-8d57549d4852.JPG', 'FAE2872C-916B-4852-BA64-6BD5087AC269.JPG',
	'FF601B96-2108-43A7-BF3D-CB8FD25B09D5.jpg', 'IMG_6781.PNG',
	'21b8b47ebefd421da244dc0211a9f3c2.MOV', 'IMG_2798.MOV',
]

const getFileType = (filename: string): 'foto' | 'video' => {
	const ext = filename.toLowerCase().split('.').pop() || ''
	const videoExts = ['mp4', 'mov', 'webm', 'avi', 'mkv']
	return videoExts.includes(ext) ? 'video' : 'foto'
}

type SortOrder = 'newest' | 'oldest'

interface DisplayItem {
	id: string
	url: string
	fecha_subida: string
	tipo: 'foto' | 'video'
	usuario_subio: string
	file_path?: string
	isLocal: boolean
}

export default function CollagePage() {
	const [allItems, setAllItems] = useState<DisplayItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
	const [isAdmin, setIsAdmin] = useState(false)
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [lightboxItem, setLightboxItem] = useState<DisplayItem | null>(null)

	// Check admin status
	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const res = await fetch('/api/auth/session')
				if (res.ok) {
					const data = await res.json()
					const adminUsers = ['santi', 'tefy']
					setIsAdmin(adminUsers.includes(data.user?.toLowerCase()))
				}
			} catch { /* ignore */ }
		}
		checkAdmin()
	}, [])

	// Hide navbar
	useEffect(() => {
		const navbar = document.querySelector('nav')
		if (navbar) navbar.style.display = 'none'
		return () => {
			const nav = document.querySelector('nav')
			if (nav) nav.style.display = ''
		}
	}, [])

	// Load all items
	useEffect(() => {
		const loadItems = async () => {
			setIsLoading(true)

			// 1. Local files as DisplayItems
			const localItems: DisplayItem[] = LOCAL_MEDIA_FILES.map((filename, i) => ({
				id: `local-${i}`,
				url: `/images/${filename}`,
				fecha_subida: '2025-01-01T00:00:00Z',
				tipo: getFileType(filename),
				usuario_subio: 'local',
				isLocal: true,
			}))

			// 2. Fetch from API (database records)
			let dbItems: DisplayItem[] = []
			try {
				const res = await fetch('/api/collage/list')
				if (res.ok) {
					const data = await res.json()
					dbItems = (data.recuerdos || []).map((r: any) => ({
						...r,
						isLocal: false,
					}))
				}
			} catch (err) {
				console.warn('Could not fetch collage from API:', err)
			}

			// 3. Combine: DB items first (they have real dates), then local
			setAllItems([...dbItems, ...localItems])
			setIsLoading(false)
		}

		loadItems()
	}, [])

	// Sort items
	const sortedItems = [...allItems].sort((a, b) => {
		const dateA = new Date(a.fecha_subida).getTime()
		const dateB = new Date(b.fecha_subida).getTime()
		return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
	})

	// Handle new upload
	const handleRecuerdoSubido = useCallback((recuerdo: CollageRecuerdo) => {
		const newItem: DisplayItem = {
			...recuerdo,
			isLocal: false,
		}
		setAllItems(prev => [newItem, ...prev])
	}, [])

	// Handle delete
	const handleDelete = useCallback(async (item: DisplayItem) => {
		if (!confirm('¿Eliminar este recuerdo del Collage?')) return

		setDeletingId(item.id)
		try {
			const res = await fetch('/api/collage/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: item.id, file_path: item.file_path }),
			})

			if (res.ok) {
				setAllItems(prev => prev.filter(i => i.id !== item.id))
				if (lightboxItem?.id === item.id) setLightboxItem(null)
			} else {
				const data = await res.json()
				alert(data.error || 'Error al eliminar')
			}
		} catch {
			alert('Error de conexión')
		} finally {
			setDeletingId(null)
		}
	}, [lightboxItem])

	// Shooting stars effect
	useEffect(() => {
		if (typeof window === 'undefined') return
		const canvas = document.createElement('canvas')
		canvas.style.position = 'fixed'
		canvas.style.top = '0'
		canvas.style.left = '0'
		canvas.style.width = '100%'
		canvas.style.height = '100%'
		canvas.style.pointerEvents = 'none'
		canvas.style.zIndex = '1'
		document.body.appendChild(canvas)
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		const shootingStars: any[] = []
		const createStar = () => {
			shootingStars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height * 0.3,
				vx: (Math.random() - 0.5) * 4 + 2,
				vy: Math.random() * 2 + 1,
				life: 0,
				maxLife: 60 + Math.random() * 40,
			})
		}
		let animId: number
		const animate = () => {
			ctx.fillStyle = 'rgba(10, 10, 26, 0.1)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			for (let i = shootingStars.length - 1; i >= 0; i--) {
				const s = shootingStars[i]
				s.x += s.vx
				s.y += s.vy
				s.life++
				if (s.life > s.maxLife || s.x > canvas.width || s.y > canvas.height) {
					shootingStars.splice(i, 1)
					continue
				}
				const alpha = 1 - s.life / s.maxLife
				ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.moveTo(s.x, s.y)
				ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10)
				ctx.stroke()
			}
			if (Math.random() < 0.02) createStar()
			animId = requestAnimationFrame(animate)
		}
		animate()
		const handleResize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}
		window.addEventListener('resize', handleResize)
		return () => {
			cancelAnimationFrame(animId)
			window.removeEventListener('resize', handleResize)
			if (document.body.contains(canvas)) document.body.removeChild(canvas)
		}
	}, [])

	if (isLoading) {
		return (
			<ConstellationBackground>
				<div className="min-h-screen flex items-center justify-center">
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
						<div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-white/70 text-lg">Cargando recuerdos...</p>
					</motion.div>
				</div>
			</ConstellationBackground>
		)
	}

	return (
		<ConstellationBackground>
			<div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 z-0" />

			<BackButton label="Volver" />

			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative z-20 pt-20 pb-4 px-4 text-center"
			>
				<h1
					className="font-display text-3xl md:text-5xl text-white font-bold mb-2"
					style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)' }}
				>
					Nuestra Historia en Imágenes
				</h1>
				<p className="text-white/60 text-sm md:text-base">
					{allItems.filter(i => !i.isLocal).length} recuerdos subidos · {allItems.filter(i => i.isLocal).length} fotos locales
				</p>
			</motion.div>

			{/* Filters bar */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="relative z-20 px-4 pb-6"
			>
				<div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3">
					<div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5">
						<svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
						</svg>
						<span className="text-white/70 text-sm mr-2">Orden:</span>
						<button
							onClick={() => setSortOrder('newest')}
							className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${sortOrder === 'newest'
									? 'bg-violet-500/30 text-violet-200 border border-violet-400/30'
									: 'text-white/50 hover:text-white/80 hover:bg-white/5'
								}`}
						>
							Más reciente
						</button>
						<button
							onClick={() => setSortOrder('oldest')}
							className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${sortOrder === 'oldest'
									? 'bg-violet-500/30 text-violet-200 border border-violet-400/30'
									: 'text-white/50 hover:text-white/80 hover:bg-white/5'
								}`}
						>
							Más antiguo
						</button>
					</div>
				</div>
			</motion.div>

			{/* Grid Gallery */}
			<div className="relative z-10 px-3 sm:px-4 md:px-8 pb-24 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
					{sortedItems.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: Math.min(index * 0.02, 1) }}
							className="relative group cursor-pointer"
							onClick={() => setLightboxItem(item)}
						>
							<div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-400/40 transition-all duration-300 shadow-lg hover:shadow-violet-500/20">
								{item.tipo === 'foto' ? (
									<Image
										src={item.url}
										alt={`Recuerdo ${index + 1}`}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
										sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
										loading="lazy"
										quality={85}
										unoptimized={item.url.startsWith('http')}
									/>
								) : (
									<video
										src={item.url}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										loop
										muted
										playsInline
										autoPlay
									/>
								)}

								{/* Hover overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

								{/* Video badge */}
								{item.tipo === 'video' && (
									<div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
										<svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								)}

								{/* Date badge for DB items */}
								{!item.isLocal && (
									<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<p className="text-white/90 text-xs font-medium">
											{new Date(item.fecha_subida).toLocaleDateString('es-ES', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
											{item.usuario_subio && ` · ${item.usuario_subio}`}
										</p>
									</div>
								)}

								{/* Admin delete button */}
								{isAdmin && !item.isLocal && (
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleDelete(item)
										}}
										disabled={deletingId === item.id}
										className="absolute top-2 left-2 bg-rose-500/80 hover:bg-rose-600 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
										title="Eliminar recuerdo"
									>
										{deletingId === item.id ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										) : (
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										)}
									</button>
								)}
							</div>
						</motion.div>
					))}
				</div>

				{sortedItems.length === 0 && (
					<div className="text-center py-20">
						<p className="text-white/50 text-lg">No hay recuerdos aún. ¡Sube el primero!</p>
					</div>
				)}
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightboxItem && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
						onClick={() => setLightboxItem(null)}
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							className="relative max-w-4xl max-h-[90vh] w-full"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close button */}
							<button
								onClick={() => setLightboxItem(null)}
								className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
							>
								<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>

							{lightboxItem.tipo === 'foto' ? (
								<div className="relative w-full h-[80vh] rounded-xl overflow-hidden">
									<Image
										src={lightboxItem.url}
										alt="Recuerdo ampliado"
										fill
										className="object-contain"
										sizes="100vw"
										quality={95}
										unoptimized={lightboxItem.url.startsWith('http')}
									/>
								</div>
							) : (
								<video
									src={lightboxItem.url}
									className="w-full max-h-[80vh] rounded-xl"
									controls
									autoPlay
									playsInline
								/>
							)}

							{/* Info bar */}
							{!lightboxItem.isLocal && (
								<div className="mt-3 flex items-center justify-between text-white/70 text-sm">
									<span>
										{new Date(lightboxItem.fecha_subida).toLocaleDateString('es-ES', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}
										{lightboxItem.usuario_subio && ` · Subido por ${lightboxItem.usuario_subio}`}
									</span>
									{isAdmin && (
										<button
											onClick={() => handleDelete(lightboxItem)}
											disabled={deletingId === lightboxItem.id}
											className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/30 rounded-xl text-rose-300 transition-all disabled:opacity-50"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
											Eliminar
										</button>
									)}
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating upload button for admins */}
			<CaptureMemoryButton onRecuerdoSubido={handleRecuerdoSubido} />
		</ConstellationBackground>
	)
}
