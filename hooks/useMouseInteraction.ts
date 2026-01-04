'use client'

import { useState, useEffect, useCallback } from 'react'

interface MousePosition {
	x: number
	y: number
}

interface Particle {
	id: number
	x: number
	y: number
	life: number
	maxLife: number
}

/**
 * Hook para interacciones globales con el mouse/touch
 * Maneja corazones que siguen el cursor y estrellitas al hacer click
 */
export function useMouseInteraction() {
	const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
	const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
	const [stars, setStars] = useState<Particle[]>([])

	// Seguir el cursor con corazones suaves
	useEffect(() => {
		if (typeof window === 'undefined') return

		let animationFrameId: number
		const heartsToFollow: Array<{ id: number; x: number; y: number; targetX: number; targetY: number }> = []
		let currentMousePos = { x: 0, y: 0 }

		const handleMouseMove = (e: MouseEvent) => {
			currentMousePos = { x: e.clientX, y: e.clientY }
			setMousePos(currentMousePos)

			// Crear corazones que siguen el cursor (máximo 3)
			if (heartsToFollow.length < 3) {
				const heart = {
					id: Date.now() + Math.random(),
					x: e.clientX,
					y: e.clientY,
					targetX: e.clientX,
					targetY: e.clientY
				}
				heartsToFollow.push(heart)
			}
		}

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches[0]) {
				currentMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
				setMousePos(currentMousePos)
			}
		}

		const animate = () => {
			setHearts(
				heartsToFollow.map(heart => {
					// Easing suave hacia el cursor
					heart.x += (heart.targetX - heart.x) * 0.1
					heart.y += (heart.targetY - heart.y) * 0.1
					heart.targetX = currentMousePos.x
					heart.targetY = currentMousePos.y

					return { id: heart.id, x: heart.x, y: heart.y }
				})
			)

			animationFrameId = requestAnimationFrame(animate)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('touchmove', handleTouchMove)
		animate()

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('touchmove', handleTouchMove)
			if (animationFrameId) cancelAnimationFrame(animationFrameId)
		}
	}, [])

	// Crear estrellitas al hacer click
	const handleClick = useCallback((e: MouseEvent | TouchEvent) => {
		const x = 'clientX' in e ? e.clientX : e.touches[0]?.clientX || 0
		const y = 'clientY' in e ? e.clientY : e.touches[0]?.clientY || 0

		// Crear 3-5 estrellitas
		const newStars: Particle[] = Array.from({ length: Math.floor(Math.random() * 3) + 3 }).map((_, i) => ({
			id: Date.now() + i,
			x: x + (Math.random() - 0.5) * 50,
			y: y + (Math.random() - 0.5) * 50,
			life: 0,
			maxLife: 1000 // 1 segundo a 60fps
		}))

		setStars(prev => [...prev, ...newStars])
	}, [])

	useEffect(() => {
		if (typeof window === 'undefined') return

		window.addEventListener('click', handleClick)
		window.addEventListener('touchstart', handleClick)

		return () => {
			window.removeEventListener('click', handleClick)
			window.removeEventListener('touchstart', handleClick)
		}
	}, [handleClick])

	// Animar estrellitas
	useEffect(() => {
		const interval = setInterval(() => {
			setStars(prev => 
				prev
					.map(star => ({ ...star, life: star.life + 1 }))
					.filter(star => star.life < star.maxLife)
			)
		}, 16) // ~60fps

		return () => clearInterval(interval)
	}, [])

	return { hearts, stars, mousePos }
}

