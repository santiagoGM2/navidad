'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para calcular los días juntos desde una fecha de inicio
 * @param startDate Fecha de inicio en formato YYYY-MM-DD o Date
 * @returns Número de días juntos
 */
export function useDaysTogether(startDate: string | Date): number {
	const [days, setDays] = useState(0)

	useEffect(() => {
		const calculateDays = () => {
			const start = typeof startDate === 'string' 
				? new Date(startDate) 
				: startDate
			
			const now = new Date()
			const diffTime = Math.abs(now.getTime() - start.getTime())
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
			
			setDays(diffDays)
		}

		calculateDays()
		// Actualizar cada hora para mantener el contador actualizado
		const interval = setInterval(calculateDays, 3600000) // 1 hora

		return () => clearInterval(interval)
	}, [startDate])

	return days
}


