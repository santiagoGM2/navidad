'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const navItems = [
	{ href: '#', label: 'Inicio' },
	{ href: '#timeline', label: 'Historia' },
	{ href: '#moments', label: 'Momentos' },
	{ href: '#final', label: 'Carta' },
]

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const { scrollYProgress } = useScroll()

	const navOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])
	const navBlur = useTransform(scrollYProgress, [0, 0.05], [0, 1])

	const handleNavClick = (href: string) => {
		if (href.startsWith('#')) {
			const element = document.querySelector(href)
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' })
			}
		}
		setIsMobileMenuOpen(false)
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
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
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

				{/* Mobile Menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden backdrop-blur-xl bg-slate-900/90 border-t border-white/10"
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
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.nav>

			{/* Spacer */}
			<div className="h-16 md:h-20" />
		</>
	)
}
