'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ConstellationBackground from '@/components/ConstellationBackground'

// Lista completa de TODOS los archivos en /public/images
// Incluye imágenes Y videos
const ALL_MEDIA_FILES = [
	// Imágenes JPG/JPEG
	'cumpleaños.jpeg',
	'fiesta 15.jpeg',
	'halloween.jpeg',
	'halloween2.jpeg',
	'invitacion especial.jpeg',
	'lagocalima.jpeg',
	'noviazgo.jpg',
	'lp_image.jpg',
	'IMG_0390.jpg',
	'IMG_0749.jpg',
	'IMG_0751.jpg',
	'IMG_0781.jpg',
	'IMG_0816.jpg',
	'IMG_0821.jpg',
	'IMG_0855.jpg',
	'IMG_0856.jpg',
	'IMG_0863.jpg',
	'IMG_0874.jpg',
	'IMG_1125.jpg',
	'IMG_1463.jpg',
	'IMG_1553.jpg',
	'IMG_1555.jpg',
	'IMG_2284.jpg',
	'IMG_2477.jpg',
	'IMG_2796.jpg',
	'IMG_2875.jpg',
	'IMG_2877.jpg',
	'IMG_2882.jpg',
	'IMG_3160.jpg',
	'IMG_3182.jpg',
	'IMG_3183.jpg',
	'IMG_3213.jpg',
	'IMG_3214.jpg',
	'IMG_3226.jpg',
	'IMG_3257.jpg',
	'IMG_3289.jpg',
	'IMG_3296.jpg',
	'IMG_3464.jpg',
	'IMG_3467.jpg',
	'IMG_3779.jpg',
	'IMG_3986.jpg',
	'IMG_4003.jpg',
	'IMG_4005.jpg',
	'IMG_4179.jpg',
	'IMG_4414.jpg',
	'IMG_4477.jpg',
	'IMG_4533.jpg',
	'IMG_5023.jpg',
	'IMG_5091.jpg',
	'IMG_5165.jpg',
	'IMG_5293.jpg',
	'IMG_5306.jpg',
	'IMG_5636.jpg',
	'IMG_5917.jpg',
	'IMG_5927.jpg',
	'IMG_6084.jpg',
	'IMG_6087.jpg',
	'IMG_6095.jpg',
	'IMG_6100.jpg',
	'IMG_6333.jpg',
	'IMG_6581.jpg',
	'IMG_6587.jpg',
	'IMG_7995.jpg',
	'IMG_8490.jpg',
	'IMG_9060.jpg',
	'IMG_9255.jpg',
	'IMG_9395.jpg',
	'IMG_9589.jpg',
	'IMG_9718.jpg',
	'IMG_9731.jpg',
	'IMG_9800.jpg',
	'IMG_9927.jpg',
	'IMG_9940.jpg',
	'0211B0E4-3B72-4ACB-B44A-A36D95B96D56.JPG',
	'0ADC408C-3C53-4AE4-91AA-BEBCA58B0EFC.JPG',
	'12C1C17B-B62E-40CE-924A-C19A170C1D1E.JPG',
	'2AE0694E-EB05-48D6-A773-ED9061DCBE59.JPG',
	'34842C8F-9BEB-4254-B5FF-80E0589B46AF.JPG',
	'35275508-BA2C-40B2-BD1D-A4B5D6653C36.JPG',
	'3A0D2D3C-7A2B-4D79-9F17-B361FD272294.JPG',
	'412005BA-32B6-4D0A-BB11-1D2634BC33E6.JPG',
	'48fe7811-7942-4346-b1c7-24ea1d7e7821.JPG',
	'4D711B1A-C190-40A0-B016-0C91DFA62367.JPG',
	'552C0AEE-5BC4-4D2D-A6B2-E2830192F1AD.JPG',
	'69D53A13-D10A-42B4-AF94-6AC7600006A3.JPG',
	'6c1b9754-b5d6-4e80-a00e-8422bcde5f77.JPG',
	'79271116-FCD8-43FE-9128-484A4BA0FC20.JPG',
	'7ABE0C21-647B-49FC-89DB-090AE030D602.JPG',
	'8209CABD-58A5-494B-BF0B-D55985912CD7.JPG',
	'822cea0c-708b-41b7-a389-705160aef8af.JPG',
	'9B446D33-E159-46F5-85EA-1A603EE9634C.JPG',
	'A40B92B6-09FA-463A-AA31-1073261DC20F.JPG',
	'bc2b5cea-b0a1-4db1-96f5-1f333d982cfd.JPG',
	'BC8F5386-ECA1-4F49-988A-6996732C9300.JPG',
	'BC9C06DA-EDD0-4E2C-96FA-81697762BFC6.JPG',
	'BF9E7FE5-1054-425E-81FF-FF8FCB4C3B9D.JPG',
	'C39DE8F1-940B-4ACA-ADA3-B249E17A497C.JPG',
	'DD5D08B7-F6AD-4AB7-B61E-9E7E9550B3C1.JPG',
	'E87B4D8E-434F-4936-8FD1-48FB8D726EFA.JPG',
	'e8e5a79f-f095-4503-8703-ef226c160cf4.JPG',
	'f04bdaa0-a21c-4992-825a-aa9ea087423f.JPG',
	'f0c71440-6bc1-4fc4-8489-8d57549d4852.JPG',
	'FAE2872C-916B-4852-BA64-6BD5087AC269.JPG',
	'FF601B96-2108-43A7-BF3D-CB8FD25B09D5.jpg',
	// PNG
	'IMG_6781.PNG',
	// VIDEOS
	'21b8b47ebefd421da244dc0211a9f3c2.MOV',
	'IMG_2798.MOV',
]

// Detectar tipo de archivo por extensión
const getFileType = (filename: string): 'image' | 'video' => {
	const ext = filename.toLowerCase().split('.').pop() || ''
	const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
	const videoExts = ['mp4', 'mov', 'webm', 'avi', 'mkv']
	
	if (imageExts.includes(ext)) return 'image'
	if (videoExts.includes(ext)) return 'video'
	return 'image' // Default
}

interface MediaItem {
	src: string
	filename: string
	type: 'image' | 'video'
	width: number
	height: number
	x: number
	y: number
	rotation: number
	scale: number
}

export default function CollagePage() {
	const containerRef = useRef<HTMLDivElement>(null)
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [totalHeight, setTotalHeight] = useState(0)
	
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end']
	})

	// Efecto parallax suave
	const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200])

	// Ocultar navbar cuando esté en /collage
	useEffect(() => {
		const navbar = document.querySelector('nav')
		if (navbar) {
			navbar.style.display = 'none'
		}
		return () => {
			// Restaurar navbar al salir
			const nav = document.querySelector('nav')
			if (nav) {
				nav.style.display = ''
			}
		}
	}, [])

	useEffect(() => {
		// Cargar todos los archivos y calcular dimensiones
		const loadMedia = async () => {
			const loadedItems: MediaItem[] = []
			let currentY = 150
			const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
			const isMobile = maxWidth < 768
			
			// Mezclar archivos para distribución aleatoria
			const shuffledFiles = [...ALL_MEDIA_FILES].sort(() => Math.random() - 0.5)
			
			// Sistema de columnas para distribución más equilibrada
			const columns = isMobile ? 1 : 3
			const columnWidth = maxWidth / columns
			const columnHeights = new Array(columns).fill(0)
			let columnIndex = 0
			
			for (const filename of shuffledFiles) {
				try {
					const src = `/images/${filename}`
					const type = getFileType(filename)
					
					if (type === 'image') {
						// Cargar imagen para obtener dimensiones
						const img = new window.Image()
						await new Promise((resolve) => {
							img.onload = resolve
							img.onerror = () => {
								console.warn(`Error loading image ${src}`)
								resolve(null)
							}
							img.src = src
						})
						
						if (!img.complete || img.naturalWidth === 0) continue
						
						// Calcular dimensiones manteniendo proporción
						const aspectRatio = img.naturalHeight / img.naturalWidth
						const baseWidth = isMobile 
							? Math.random() * 200 + 200 // Mobile: 200-400px
							: Math.random() * 300 + 220 // Desktop: 220-520px
						const width = Math.min(baseWidth, maxWidth * (isMobile ? 0.8 : 0.35))
						const height = width * aspectRatio
						
						// Distribución en columnas alternadas
						if (!isMobile) {
							// Encontrar la columna con menor altura
							columnIndex = columnHeights.indexOf(Math.min(...columnHeights))
						}
						
						const x = isMobile
							? maxWidth * 0.5 // Centrado en mobile
							: columnIndex * columnWidth + (columnWidth - width) / 2 + Math.random() * 40 - 20
						
						const rotation = (Math.random() - 0.5) * 6 // Rotación entre -3 y 3 grados
						const scale = 0.94 + Math.random() * 0.12 // Escala entre 0.94 y 1.06
						
						// Calcular Y basado en la altura de la columna
						const y = isMobile 
							? currentY + Math.random() * 80
							: columnHeights[columnIndex] + 50 + Math.random() * 60
						
						loadedItems.push({
							src,
							filename,
							type: 'image',
							width,
							height,
							x,
							y,
							rotation,
							scale
						})
						
						if (isMobile) {
							currentY = y + height + 40 + Math.random() * 80
						} else {
							columnHeights[columnIndex] = y + height
							currentY = Math.max(...columnHeights)
						}
					} else if (type === 'video') {
						// Para videos, usar dimensiones estándar
						const aspectRatio = 16 / 9
						const baseWidth = isMobile 
							? Math.random() * 200 + 220 // Mobile: 220-420px
							: Math.random() * 350 + 280 // Desktop: 280-630px
						const width = Math.min(baseWidth, maxWidth * (isMobile ? 0.8 : 0.4))
						const height = width * aspectRatio
						
						if (!isMobile) {
							columnIndex = columnHeights.indexOf(Math.min(...columnHeights))
						}
						
						const x = isMobile
							? maxWidth * 0.5
							: columnIndex * columnWidth + (columnWidth - width) / 2 + Math.random() * 30 - 15
						const rotation = (Math.random() - 0.5) * 4
						const scale = 0.96 + Math.random() * 0.08
						
						const y = isMobile 
							? currentY + Math.random() * 80
							: columnHeights[columnIndex] + 50 + Math.random() * 60
						
						loadedItems.push({
							src,
							filename,
							type: 'video',
							width,
							height,
							x,
							y,
							rotation,
							scale
						})
						
						if (isMobile) {
							currentY = y + height + 40 + Math.random() * 80
						} else {
							columnHeights[columnIndex] = y + height
							currentY = Math.max(...columnHeights)
						}
					}
				} catch (error) {
					console.warn(`Error processing ${filename}:`, error)
				}
			}
			
			setMediaItems(loadedItems)
			setTotalHeight(currentY + 500) // Altura total del collage
			setIsLoading(false)
		}
		
		loadMedia()
	}, [])

	// Efecto de estrellas fugaces
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
		
		const shootingStars: Array<{
			x: number
			y: number
			vx: number
			vy: number
			life: number
			maxLife: number
		}> = []
		
		const createShootingStar = () => {
			shootingStars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height * 0.3,
				vx: (Math.random() - 0.5) * 4 + 2,
				vy: Math.random() * 2 + 1,
				life: 0,
				maxLife: 60 + Math.random() * 40
			})
		}
		
		const animate = () => {
			ctx.fillStyle = 'rgba(10, 10, 26, 0.1)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			
			for (let i = shootingStars.length - 1; i >= 0; i--) {
				const star = shootingStars[i]
				star.x += star.vx
				star.y += star.vy
				star.life++
				
				if (star.life > star.maxLife || star.x > canvas.width || star.y > canvas.height) {
					shootingStars.splice(i, 1)
					continue
				}
				
				const alpha = 1 - (star.life / star.maxLife)
				ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.moveTo(star.x, star.y)
				ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10)
				ctx.stroke()
			}
			
			if (Math.random() < 0.02) {
				createShootingStar()
			}
			
			requestAnimationFrame(animate)
		}
		
		animate()
		
		const handleResize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}
		
		window.addEventListener('resize', handleResize)
		
		return () => {
			window.removeEventListener('resize', handleResize)
			if (document.body.contains(canvas)) {
				document.body.removeChild(canvas)
			}
		}
	}, [])

	if (isLoading) {
		return (
			<ConstellationBackground>
				<div className="min-h-screen flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center"
					>
						<div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-white/70">Cargando recuerdos...</p>
					</motion.div>
				</div>
			</ConstellationBackground>
		)
	}

	return (
		<ConstellationBackground>
			<div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 z-0" />
			
			{/* Botón de regreso */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="fixed top-6 left-6 z-50"
			>
				<Link href="/">
					<motion.button
						className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white font-medium"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						← Volver
					</motion.button>
				</Link>
			</motion.div>

			{/* Título */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none"
			>
				<h1 
					className="font-display text-2xl md:text-4xl text-white font-bold"
					style={{ 
						textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
					}}
				>
					Nuestra Historia en Imágenes
				</h1>
			</motion.div>

			{/* Collage de medios */}
			<div 
				ref={containerRef}
				className="relative py-20 px-4 md:px-8"
				style={{ 
					zIndex: 10,
					minHeight: `${totalHeight}px`
				}}
			>
				<motion.div
					style={{ y: parallaxY }}
					className="relative w-full"
				>
					{mediaItems.map((item, index) => {
						const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
						const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
						
						return (
							<motion.div
								key={`${item.filename}-${index}`}
								initial={{ opacity: 0, scale: 0.8, y: 20 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ 
									duration: 0.6,
									delay: index * 0.02,
									ease: 'easeOut'
								}}
								className="absolute"
								style={{
									left: isMobile ? '50%' : `${item.x}px`,
									top: `${item.y}px`,
									width: `${item.width}px`,
									height: `${item.height}px`,
									transform: isMobile 
										? `translateX(-50%) rotate(${item.rotation}deg) scale(${item.scale})`
										: `rotate(${item.rotation}deg) scale(${item.scale})`,
									transformOrigin: 'center center',
									maxWidth: isMobile ? `${maxWidth * 0.85}px` : 'none'
								}}
							>
								<div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-white/10 hover:border-white/30 transition-all duration-500 group backdrop-blur-sm">
									{item.type === 'image' ? (
										<>
											<Image
												src={item.src}
												alt={`Recuerdo ${index + 1}`}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-700"
												sizes="(max-width: 768px) 85vw, 500px"
												loading="lazy"
												quality={85}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
										</>
									) : (
										<>
											<video
												src={item.src}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
												loop
												muted
												playsInline
												autoPlay
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
										</>
									)}
								</div>
							</motion.div>
						)
					})}
				</motion.div>
			</div>
		</ConstellationBackground>
	)
}
