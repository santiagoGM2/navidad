'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FinalPage() {
	const router = useRouter()

	useEffect(() => {
		// Redirigir a la pagina principal con scroll a la seccion final
		router.replace('/#final')
	}, [router])

	return (
		<main className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
				<p className="text-white/80">Redirigiendo...</p>
			</div>
		</main>
	)
}

