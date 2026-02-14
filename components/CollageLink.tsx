'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { saveScrollPosition } from './ScrollRestore'

export default function CollageLink() {
	const handleClick = () => {
		saveScrollPosition(window.location.pathname)
	}

	return (
		<Link href="/collage" onClick={handleClick}>
			<motion.button
				className="w-full py-6 md:py-8 px-8 md:px-12 rounded-full bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 relative overflow-hidden group"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
					initial={{ x: '-100%' }}
					whileHover={{ x: '100%' }}
					transition={{ duration: 0.6 }}
				/>
				<span
					className="relative z-10 font-display text-lg md:text-xl lg:text-2xl font-semibold text-white"
					style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
				>
					Conoce más esta historia de amor
				</span>
			</motion.button>
		</Link>
	)
}
