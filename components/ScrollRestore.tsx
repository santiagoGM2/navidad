'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SCROLL_KEY_PREFIX = 'scroll_position_'

export function saveScrollPosition(path: string) {
	if (typeof window === 'undefined') return
	const key = SCROLL_KEY_PREFIX + path
	window.sessionStorage.setItem(key, String(window.scrollY))
}

export default function ScrollRestore() {
	const pathname = usePathname()

	useEffect(() => {
		// Restaurar posición guardada para esta ruta
		const key = SCROLL_KEY_PREFIX + pathname
		const saved = window.sessionStorage.getItem(key)
		
		if (saved !== null) {
			const y = parseInt(saved, 10)
			if (Number.isFinite(y)) {
				// Usar timeout para asegurar que el DOM esté listo
				const timeoutId = setTimeout(() => {
					window.scrollTo({ top: y, left: 0, behavior: 'instant' })
				}, 0)
				return () => clearTimeout(timeoutId)
			}
		}
	}, [pathname])

	// Guardar posición antes de navegar
	useEffect(() => {
		const handleBeforeUnload = () => {
			saveScrollPosition(pathname)
		}

		// Guardar en intervalos para capturar scroll en secciones
		const intervalId = setInterval(() => {
			saveScrollPosition(pathname)
		}, 1000)

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
			clearInterval(intervalId)
			saveScrollPosition(pathname)
		}
	}, [pathname])

	return null
}
