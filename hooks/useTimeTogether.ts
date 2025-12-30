'use client'

import { useState, useEffect } from 'react'

interface TimeTogether {
	days: number
	hours: number
	minutes: number
	seconds: number
}

/**
 * Hook para calcular el tiempo juntos desde una fecha de inicio
 * @param startDate Fecha de inicio en formato YYYY-MM-DD o Date
 * @returns Objeto con días, horas, minutos y segundos
 */
export function useTimeTogether(startDate: string | Date): TimeTogether {
	const [time, setTime] = useState<TimeTogether>({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	})

	useEffect(() => {
		const calculateTime = () => {
			const start = typeof startDate === 'string' 
				? new Date(startDate) 
				: startDate
			
			const now = new Date()
			const diffTime = Math.abs(now.getTime() - start.getTime())
			
			const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
			const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)
			
			setTime({ days, hours, minutes, seconds })
		}

		calculateTime()
		// Actualizar cada segundo para precisión absoluta
		const interval = setInterval(calculateTime, 1000)

		return () => clearInterval(interval)
	}, [startDate])

	return time
}

