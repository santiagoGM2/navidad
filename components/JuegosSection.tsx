'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { saveScrollPosition } from '@/components/ScrollRestore'

export default function JuegosSection() {
	const pathname = usePathname()

	const handleClick = () => {
		if (pathname) {
			saveScrollPosition(pathname)
		}
	}

	return (
		<section id="juegos" className="py-24 md:py-32 px-6 relative z-10">
			<div className="max-w-4xl mx-auto flex justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, type: 'spring' }}
					viewport={{ once: true }}
				>
					<Link
						href="/juegos"
						onClick={handleClick}
						className="group relative block"
					>
						{/* Glow effect */}
						<div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

						<motion.button
							className="relative py-6 px-12 md:py-8 md:px-16 rounded-2xl bg-slate-900 ring-1 ring-white/10 leading-none flex items-center gap-4 overflow-hidden"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="text-3xl md:text-4xl filter drop-shadow-lg group-hover:rotate-12 transition-transform duration-300">
								🎮
							</span>
							<div className="text-left">
								<span className="block text-white font-display text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-pink-200 group-hover:from-white group-hover:to-white transition-all">
									Juguemos
								</span>
								<span className="text-violet-200/60 text-sm font-medium tracking-wide group-hover:text-violet-200/90 transition-colors">
									Click para entrar
								</span>
							</div>

							{/* Shine effect */}
							<motion.div
								className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
								initial={{ x: '-100%' }}
								whileHover={{ x: '100%' }}
								transition={{ duration: 0.7 }}
							/>
						</motion.button>
					</Link>
				</motion.div>
			</div>
		</section>
	)
}
