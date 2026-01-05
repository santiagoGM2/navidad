'use client'

import { useState, useEffect } from 'react'

interface Countdown {
	days: number
	hours: number
	minutes: number
	seconds: number
	isExpired: boolean
}

/**
 * Hook para calcular countdown hasta una fecha específica
 * @param targetDate Fecha objetivo en formato YYYY-MM-DD o Date
 * @returns Objeto con días, horas, minutos, segundos restantes y si ya expiró
 */
export function useCountdown(targetDate: string | Date): Countdown {
	const [countdown, setCountdown] = useState<Countdown>({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		isExpired: false
	})

	useEffect(() => {
		const calculateCountdown = () => {
			const target = typeof targetDate === 'string' 
				? new Date(targetDate + 'T00:00:00') 
				: targetDate
			
			const now = new Date()
			const diffTime = target.getTime() - now.getTime()
			
			if (diffTime <= 0) {
				setCountdown({
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
					isExpired: true
				})
				return
			}
			
			const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
			const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)
			
			setCountdown({
				days,
				hours,
				minutes,
				seconds,
				isExpired: false
			})
		}

		calculateCountdown()
		const interval = setInterval(calculateCountdown, 1000) // Actualizar cada segundo

		return () => clearInterval(interval)
	}, [targetDate])

	return countdown
}

