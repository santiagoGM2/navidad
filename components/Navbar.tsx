'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const navItems = [
	{ href: '#', label: 'Inicio' },
	{ href: '#timeline', label: 'Historia' },
	{ href: '#moments', label: 'Pequeños Instantes' },
	{ href: '/collage', label: 'Collage' },
	{ href: '/ahorros', label: 'Nuestro Ahorro' },
	{ href: '/planes', label: 'Sueños Juntos' },
	{ href: '/cumpleanera', label: 'Cumpleañera' },
]

export default function Navbar() {
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [user, setUser] = useState<string | null>(null)
	const [showLoginModal, setShowLoginModal] = useState(false)
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
	const { scrollYProgress } = useScroll()

	const navBlur = useTransform(scrollYProgress, [0, 0.05], [0, 1])

	useEffect(() => {
		checkSession()
	}, [])

	const checkSession = async () => {
		try {
			const res = await fetch('/api/auth/session')
			if (res.ok) {
				const data = await res.json()
				setUser(data.user || null)
			}
		} catch {
			setUser(null)
		}
	}

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' })
			setUser(null)
			setShowLogoutConfirm(false)
			window.dispatchEvent(new Event('auth-change'))
		} catch {
			// Silently fail
		}
	}

	const handleNavClick = (href: string) => {
		if (href === '#') {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else if (href.startsWith('#')) {
			const element = document.querySelector(href)
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' })
			}
		} else {
			// It's a real route, handle it normally (Link will handle it if we use it, but here we are in a button onClick)
			window.location.href = href
		}
		setIsMobileMenuOpen(false)
	}

	const handleAuthClick = () => {
		if (user) {
			setShowLogoutConfirm(true)
		} else {
			setShowLoginModal(true)
		}
	}

	return (
		<>
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
				className="fixed top-0 left-0 right-0 z-nav"
			>
				<motion.div
					className="absolute inset-0 backdrop-blur-xl"
					style={{
						opacity: navBlur,
						background: 'linear-gradient(180deg, rgba(10, 10, 26, 0.8) 0%, rgba(10, 10, 26, 0.4) 100%)'
					}}
				/>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 md:h-20">
						{/* Logo */}
						<Link
							href="/"
							className="flex items-center gap-3 group"
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						>
							<motion.div
								whileHover={{ scale: 1.1, rotate: 5 }}
								whileTap={{ scale: 0.95 }}
								className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
							>
								<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
								</svg>
							</motion.div>
							<span className="font-display text-xl md:text-2xl font-semibold text-white group-hover:text-violet-300 transition-colors">
								Cachetona
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-1">
							{navItems.map((item) => (
								<button
									key={item.href}
									onClick={() => handleNavClick(item.href)}
									className="relative px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors group"
								>
									<span className="relative z-10 text-sm font-medium">
										{item.label}
									</span>
									<motion.div
										className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
									/>
								</button>
							))}

							{/* Botones Auth Desktop */}
							{user ? (
								<>
									<motion.button
										onClick={() => setShowLoginModal(true)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg> Admin
									</motion.button>
									<motion.button
										onClick={() => setShowLogoutConfirm(true)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="ml-2 px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white text-sm font-medium transition-all"
									>
										Salir
									</motion.button>
								</>
							) : (
								<motion.button
									onClick={() => setShowLoginModal(true)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/30"
								>
									Acceder
								</motion.button>
							)}
						</div>

						{/* Mobile Menu Button + Auth Button */}
						<div className="md:hidden flex items-center gap-2">
							{user ? (
								<motion.button
									onClick={() => setShowLoginModal(true)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-3 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-violet-500/30 flex items-center gap-1"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</motion.button>
							) : (
								<motion.button
									onClick={() => setShowLoginModal(true)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-violet-500/30"
								>
									Acceder
								</motion.button>
							)}

							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
								aria-label="Toggle menu"
							>
								<motion.svg
									animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									{isMobileMenuOpen ? (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									) : (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									)}
								</motion.svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden backdrop-blur-xl bg-black/90 border-t border-white/10"
						>
							<div className="px-4 py-4 space-y-2">
								{navItems.map((item) => (
									<button
										key={item.href}
										onClick={() => handleNavClick(item.href)}
										className="block w-full px-4 py-3 rounded-lg text-left text-white/70 hover:text-white hover:bg-white/10 transition-all"
									>
										{item.label}
									</button>
								))}
								{user && (
									<>
										<button
											onClick={() => {
												setShowLoginModal(true)
												setIsMobileMenuOpen(false)
											}}
											className="block w-full px-4 py-3 rounded-lg text-left text-violet-300 hover:text-violet-100 hover:bg-white/10 transition-all border-t border-white/10 mt-2"
										>
											Panel de Administración
										</button>
										<button
											onClick={() => {
												setShowLogoutConfirm(true)
												setIsMobileMenuOpen(false)
											}}
											className="block w-full px-4 py-3 rounded-lg text-left text-rose-300 hover:text-rose-100 hover:bg-white/10 transition-all"
										>
											Cerrar Sesión
										</button>
									</>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.nav>

			{/* Modal de Login / Admin */}
			<AnimatePresence>
				{showLoginModal && (
					<LoginModal
						onClose={() => setShowLoginModal(false)}
						onSuccess={(username) => {
							setUser(username)
						}}
						isLoggedIn={!!user}
					/>
				)}
			</AnimatePresence>

			{/* Confirmación de Logout */}
			<AnimatePresence>
				{showLogoutConfirm && (
					<LogoutConfirm
						onConfirm={handleLogout}
						onCancel={() => setShowLogoutConfirm(false)}
					/>
				)}
			</AnimatePresence>

			{/* Spacer */}
			<div className="h-16 md:h-20" />
		</>
	)
}

function LoginModal({
	onClose,
	onSuccess,
	isLoggedIn
}: {
	onClose: () => void;
	onSuccess: (username: string) => void;
	isLoggedIn: boolean;
}) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [showOptions, setShowOptions] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		if (isLoggedIn) {
			setShowOptions(true)
		}
	}, [isLoggedIn])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			})
			const data = await res.json()

			if (!res.ok) {
				setError(data.error || 'Error al iniciar sesión')
				return
			}

			setSuccess(true)
			onSuccess(data.username)
			window.dispatchEvent(new Event('auth-change'))
			setTimeout(() => setShowOptions(true), 1000)
		} catch {
			setError('Error de conexión')
		} finally {
			setLoading(false)
		}
	}

	if (showOptions) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
				className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
					className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-center"
				>
					<h2 className="font-display text-2xl font-bold text-white mb-6">
						Panel de Administración
					</h2>
					<div className="grid gap-4">
						<button
							onClick={() => {
								document.getElementById('btn-collage')?.click()
								onClose()
							}}
							className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all flex items-center justify-center gap-3 shadow-lg group"
						>
							<svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Subir Recuerdo
						</button>
						<Link
							href="/admin/dashboard"
							onClick={onClose}
							className="w-full py-4 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all flex items-center justify-center gap-3 group"
						>
							<svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Panel de Administración
						</Link>
					</div>
					<button
						onClick={onClose}
						className="mt-6 text-white/50 hover:text-white text-sm transition-colors"
					>
						Cerrar Panel
					</button>
				</motion.div>
			</motion.div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
			className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
			>
				{success ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-8"
					>
						<div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-white mb-2">Acceso concedido</h3>
						<p className="text-white/70">Sesión iniciada correctamente</p>
					</motion.div>
				) : (
					<>
						<div className="text-center mb-6">
							<h2 className="font-display text-2xl font-bold text-white mb-2">
								Acceso privado
							</h2>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
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
									className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
									placeholder="Usuario"
									required
								/>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1.5">
									Contraseña
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 pr-12 transition-all"
										placeholder="Contraseña"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
										tabIndex={-1}
									>
										{showPassword ? (
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
											</svg>
										) : (
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
							</div>

							{error && (
								<p className="text-sm text-rose-300 bg-rose-500/20 rounded-lg px-3 py-2">
									{error}
								</p>
							)}

							<div className="flex gap-3 pt-2">
								<button
									type="button"
									onClick={onClose}
									className="flex-1 py-3 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={loading}
									className="flex-1 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 transition-all"
								>
									{loading ? 'Entrando...' : 'Ingresar'}
								</button>
							</div>
						</form>
					</>
				)}
			</motion.div>
		</motion.div>
	)
}

function LogoutConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onCancel}
			className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-center"
			>
				<h3 className="font-display text-xl font-bold text-white mb-2">
					¿Cerrar sesión?
				</h3>
				<p className="text-white/70 text-sm mb-6">
					Tendrás que ingresar tus credenciales nuevamente.
				</p>
				<div className="flex gap-3">
					<button
						onClick={onCancel}
						className="flex-1 py-2.5 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
					>
						Cancelar
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 py-2.5 rounded-xl font-medium text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20"
					>
						Salir
					</button>
				</div>
			</motion.div>
		</motion.div>
	)
}
