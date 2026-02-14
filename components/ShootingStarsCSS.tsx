'use client'

import { useState, useEffect, useMemo } from 'react'

const STAR_COUNT = 6

function useShootingStar() {
	return useMemo(() => {
		const startX = Math.random() * 100
		const startY = Math.random() * 35
		const angle = (Math.random() * 0.4 + 0.5) * Math.PI
		const dist = 80 + Math.random() * 60
		const x = Math.cos(angle) * dist
		const y = Math.sin(angle) * dist
		return {
			left: `${startX}%`,
			top: `${startY}%`,
			'--shoot-x': `${x}vw`,
			'--shoot-y': `${y}vh`,
			delay: Math.random() * 4,
			duration: 1.4 + Math.random() * 0.6,
		}
	}, [])
}

function SingleStar() {
	const [mounted, setMounted] = useState(false)
	const style = useShootingStar()

	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 100)
		return () => clearTimeout(t)
	}, [])

	if (!mounted) return null

	return (
		<div
			className="absolute w-1 h-1 rounded-full bg-white animate-shooting-star"
			style={{
				left: style.left,
				top: style.top,
				['--shoot-x']: style['--shoot-x'],
				['--shoot-y']: style['--shoot-y'],
				animationDelay: `${style.delay}s`,
				animationDuration: `${style.duration}s`,
			} as React.CSSProperties}
			aria-hidden
		/>
	)
}

export default function ShootingStarsCSS() {
	const [key, setKey] = useState(0)
	useEffect(() => {
		const id = setInterval(() => setKey((k) => k + 1), 3500)
		return () => clearInterval(id)
	}, [])

	return (
		<div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden>
			{Array.from({ length: STAR_COUNT }).map((_, i) => (
				<SingleStar key={`${key}-${i}`} />
			))}
		</div>
	)
}
