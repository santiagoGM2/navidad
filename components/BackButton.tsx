'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface BackButtonProps {
	href?: string
	label?: string
	className?: string
}

export default function BackButton({ href, label = 'Volver', className = '' }: BackButtonProps) {
	const router = useRouter()

	const handleClick = () => {
		if (href) {
			router.push(href)
		} else {
			router.back()
		}
	}

	return (
		<motion.button
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			onClick={handleClick}
			className={`fixed bottom-6 left-6 z-40 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white font-medium shadow-lg ${className}`}
			whileHover={{ scale: 1.05, x: -5 }}
			whileTap={{ scale: 0.95 }}
		>
			<span className="flex items-center gap-2">
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				{label}
			</span>
		</motion.button>
	)
}
