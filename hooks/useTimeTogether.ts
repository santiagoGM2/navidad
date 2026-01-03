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
			try {
				const start = typeof startDate === 'string' 
					? new Date(startDate) 
					: startDate
				
				const now = new Date()
				const diffTime = Math.abs(now.getTime() - start.getTime())
				
				// Cálculo correcto de tiempo transcurrido
				const totalSeconds = Math.floor(diffTime / 1000)
				const days = Math.floor(totalSeconds / (60 * 60 * 24))
				const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
				const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
				const seconds = totalSeconds % 60
				
				setTime({ days, hours, minutes, seconds })
			} catch (error) {
				// Fallback en caso de error para que el contador nunca se detenga
				console.error('Error calculando tiempo:', error)
				setTime(prev => prev) // Mantener valores anteriores
			}
		}

		// Calcular inmediatamente
		calculateTime()
		
		// Actualizar cada segundo para precisión absoluta
		// Usar requestAnimationFrame para mejor rendimiento
		let rafId: number
		let lastUpdate = Date.now()
		
		const updateLoop = () => {
			const now = Date.now()
			if (now - lastUpdate >= 1000) {
				calculateTime()
				lastUpdate = now
			}
			rafId = requestAnimationFrame(updateLoop)
		}
		
		rafId = requestAnimationFrame(updateLoop)

		return () => {
			if (rafId) cancelAnimationFrame(rafId)
		}
	}, [startDate])

	return time
}


