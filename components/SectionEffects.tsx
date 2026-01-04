'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface SectionEffectsProps {
	sectionId: string
	effectType: 'particles' | 'elegant'
}

/**
 * Componente para efectos visuales por sección
 * Partículas suaves para recuerdos, animaciones elegantes para carta final
 */
export default function SectionEffects({ sectionId, effectType }: SectionEffectsProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		let animationFrameId: number
		let width = window.innerWidth
		let height = window.innerHeight

		const resize = () => {
			width = window.innerWidth
			height = window.innerHeight
			canvas.width = width
			canvas.height = height
		}
		window.addEventListener('resize', resize)
		resize()

		if (effectType === 'particles') {
			// Partículas suaves flotantes para recuerdos
			const particleCount = 30
			const particles: Array<{
				x: number
				y: number
				vx: number
				vy: number
				size: number
				opacity: number
			}> = []

			for (let i = 0; i < particleCount; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.3,
					vy: (Math.random() - 0.5) * 0.3,
					size: Math.random() * 2 + 1,
					opacity: Math.random() * 0.3 + 0.2
				})
			}

			const render = () => {
				ctx.clearRect(0, 0, width, height)

				particles.forEach(particle => {
					particle.x += particle.vx
					particle.y += particle.vy

					// Wrap around
					if (particle.x < 0) particle.x = width
					if (particle.x > width) particle.x = 0
					if (particle.y < 0) particle.y = height
					if (particle.y > height) particle.y = 0

					// Draw
					ctx.beginPath()
					ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
					ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
					ctx.fill()
				})

				animationFrameId = requestAnimationFrame(render)
			}

			render()
		} else if (effectType === 'elegant') {
			// Efecto elegante para carta final - ondas suaves
			let time = 0

			const render = () => {
				ctx.clearRect(0, 0, width, height)

				// Ondas suaves y elegantes
				for (let i = 0; i < 3; i++) {
					const waveOffset = (time * 0.0005) + (i * Math.PI / 3)
					const amplitude = 20 + i * 10
					const frequency = 0.001

					ctx.beginPath()
					ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 - i * 0.02})`
					ctx.lineWidth = 2

					for (let x = 0; x < width; x += 2) {
						const y = height / 2 + Math.sin(x * frequency + waveOffset) * amplitude
						if (x === 0) {
							ctx.moveTo(x, y)
						} else {
							ctx.lineTo(x, y)
						}
					}

					ctx.stroke()
				}

				time++
				animationFrameId = requestAnimationFrame(render)
			}

			render()
		}

		return () => {
			window.removeEventListener('resize', resize)
			cancelAnimationFrame(animationFrameId)
		}
	}, [effectType])

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-[5] opacity-40"
			style={{ mixBlendMode: 'screen' }}
		/>
	)
}

