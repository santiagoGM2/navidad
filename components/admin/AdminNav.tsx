'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { AllowedUsername } from '@/lib/auth-constants'

const LINKS = [
	{ href: '/admin/dashboard', label: 'Panel' },
	{ href: '/admin/subir-foto', label: 'Subir Recuerdo' },
	{ href: '/collage', label: 'Collage' },
	{ href: '/admin/recuerdos', label: 'Historial' },
	{ href: '/admin/recap', label: 'Recap' },
] as const

export default function AdminNav({ username }: { username: AllowedUsername }) {
	const router = useRouter()

	const handleLogout = useCallback(async () => {
		await fetch('/api/auth/logout', { method: 'POST' })
		router.push('/admin/login')
		router.refresh()
	}, [router])

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
			<div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-6">
					<Link
						href="/admin/dashboard"
						className="font-display text-lg font-semibold text-white hover:text-white/90 transition-colors"
					>
						Cachetona Admin
					</Link>
					<nav className="flex flex-wrap gap-3">
						{LINKS.map(({ href, label }) => (
							<Link
								key={href}
								href={href}
								className="text-sm text-white/80 hover:text-white transition-colors"
							>
								{label}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-sm text-white/60">{username}</span>
					<button
						type="button"
						onClick={handleLogout}
						className="text-sm text-white/70 hover:text-white transition-colors"
					>
						Cerrar sesión
					</button>
					<Link
						href="/"
						className="text-sm text-white/60 hover:text-white transition-colors"
					>
						Ver sitio →
					</Link>
				</div>
			</div>
		</header>
	)
}
