'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
	'Mi paz',
	'Mi suerte',
	'Mi debilidad',
	'Mi todo',
	'Mi hogar',
	'Mi calma',
	'Mi alegría',
	'Mi razón',
	'Mi complicidad',
	'Mi refugio',
	'Mi fuerza',
	'Mi luz',
	'Mi tesoro',
	'Mi vida',
	'Mi amor',
	'Mi confidente',
	'Mi equipo',
	'Mi persona',
	'Mi risa',
	'Mi abrazo',
]

const WORDS_PER_BLOCK = 3
const BLOCKS_COUNT = 9

function getDayOfYear(): number {
	const now = new Date()
	const start = new Date(now.getFullYear(), 0, 0)
	const diff = now.getTime() - start.getTime()
	const oneDay = 1000 * 60 * 60 * 24
	return Math.min(Math.floor(diff / oneDay) + 1, 365)
}

/**
 * Selección determinística de palabras por día (solo en cliente).
 * Devuelve 9 bloques de hasta 3 palabras cada uno.
 */
function getBlocksForToday(): string[][] {
	const day = getDayOfYear()
	const n = WORDS.length
	const blocks: string[][] = []
	for (let b = 0; b < BLOCKS_COUNT; b++) {
		const block: string[] = []
		for (let w = 0; w < WORDS_PER_BLOCK; w++) {
			const idx = (day * 7 + b * 3 + w) % n
			block.push(WORDS[idx])
		}
		blocks.push(block)
	}
	return blocks
}

export default function HowISeeYou() {
	const [blocks, setBlocks] = useState<string[][]>([])
	useEffect(() => setBlocks(getBlocksForToday()), [])

	return (
		<section className="py-32 md:py-48 px-6 relative z-10">
			<div className="max-w-4xl mx-auto">
				<motion.div
					className="text-center mb-14 md:mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2
						className="font-display text-3xl md:text-5xl text-white font-bold mb-4"
						style={{
							textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
						}}
					>
						Así te veo yo
					</h2>
					<p
						className="text-base md:text-lg font-light"
						style={{
							color: 'rgba(255, 255, 255, 0.85)',
							textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
						}}
					>
						Una constelación que cambia cada día
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					{(blocks.length > 0 ? blocks : Array.from({ length: BLOCKS_COUNT }, () => [])).map(
						(blockWords, blockIndex) => (
							<motion.div
								key={blockIndex}
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: blockIndex * 0.06, duration: 0.4 }}
								viewport={{ once: true }}
								className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 text-center min-h-[88px] flex flex-col justify-center"
							>
								{blockWords.length > 0 && (
									<p
										className="font-display text-base md:text-lg font-medium leading-snug"
										style={{
											color: 'rgba(255, 255, 255, 0.95)',
											textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
										}}
									>
										{blockWords.slice(0, 3).join(' · ')}
									</p>
								)}
							</motion.div>
						)
					)}
				</motion.div>
			</div>
		</section>
	)
}
