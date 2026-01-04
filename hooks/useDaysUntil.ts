'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para calcular días restantes hasta una fecha específica
 * @param targetDate Fecha objetivo en formato YYYY-MM-DD o Date
 * @returns Días restantes (0 si ya pasó o es hoy)
 */
export function useDaysUntil(targetDate: string | Date): number {
	const [daysUntil, setDaysUntil] = useState(0)

	useEffect(() => {
		const calculateDays = () => {
			const target = typeof targetDate === 'string' 
				? new Date(targetDate) 
				: targetDate
			
			const now = new Date()
			now.setHours(0, 0, 0, 0)
			target.setHours(0, 0, 0, 0)
			
			const diffTime = target.getTime() - now.getTime()
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
			
			setDaysUntil(Math.max(0, diffDays))
		}

		calculateDays()
		const interval = setInterval(calculateDays, 1000 * 60 * 60) // Actualizar cada hora

		return () => clearInterval(interval)
	}, [targetDate])

	return daysUntil
}

