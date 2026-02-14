'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const from = searchParams.get('from') || '/admin/dashboard'
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				setError(data.error || 'Error al iniciar sesión')
				return
			}
			router.push(from)
			router.refresh()
		} catch {
			setError('Error de conexión')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center px-6"
			style={{
				background: 'linear-gradient(180deg, #0f0a15 0%, #1a0f2e 40%, #1e1b4b 100%)',
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-sm"
			>
				<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
					<div className="text-center mb-8">
						<h1 className="font-display text-2xl font-bold text-white mb-2">
							Acceso privado
						</h1>
						<p className="text-white/70 text-sm">
							Solo para vos dos
						</p>
					</div>
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-white/90 mb-1.5">
								Usuario
							</label>
							<input
								id="username"
								type="text"
								autoComplete="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50"
								placeholder="Tu nombre"
								required
							/>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1.5">
								Contraseña
							</label>
							<input
								id="password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50"
								placeholder="••••••••"
								required
							/>
						</div>
						{error && (
							<p className="text-sm text-rose-300 bg-rose-500/20 rounded-lg px-3 py-2">
								{error}
							</p>
						)}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
						>
							{loading ? 'Entrando...' : 'Entrar'}
						</button>
					</form>
					<p className="mt-6 text-center">
						<Link
							href="/"
							className="text-sm text-white/60 hover:text-white transition-colors"
						>
							← Volver al sitio
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	)
}

export default function AdminLoginPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/70">Cargando...</div>}>
			<LoginForm />
		</Suspense>
	)
}
