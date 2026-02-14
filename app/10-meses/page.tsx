'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnniversaryFlowerIntro from '@/components/anniversary/AnniversaryFlowerIntro'
import AnniversaryHub from '@/components/anniversary/AnniversaryHub'
import BackButton from '@/components/BackButton'

export default function TenMesesPage() {
	const [showIntro, setShowIntro] = useState(true)

	const handleContinue = () => setShowIntro(false)

	return (
		<div
			className="min-h-screen relative overflow-hidden"
			style={{
				background: 'linear-gradient(180deg, #0f0a15 0%, #1a0f2e 40%, #1e1b4b 100%)',
			}}
		>
			<AnimatePresence mode="wait">
				{showIntro ? (
					<motion.div
						key="intro"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="min-h-screen"
					>
						<AnniversaryFlowerIntro onContinue={handleContinue} />
					</motion.div>
				) : (
					<motion.div
						key="hub"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
						className="relative py-16 md:py-24 px-4 md:px-6"
					>
						<BackButton label="Volver" />
						
						<div className="max-w-2xl mx-auto">
							<p
								className="text-sm md:text-base uppercase tracking-[0.2em] mb-10"
								style={{ color: 'rgba(255, 255, 255, 0.6)' }}
							>
								Tu espacio especial
							</p>
							<AnniversaryHub />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
