'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function JuegosSection() {
	return (
		<section id="juegos" className="py-32 md:py-48 px-6 relative z-10">
			<div className="max-w-4xl mx-auto">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<Link href="/juegos" className="block group">
						<motion.div
							className="rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md p-8 md:p-12 text-center max-w-lg mx-auto hover:bg-white/10 hover:border-white/30 transition-all duration-500"
							whileHover={{ scale: 1.02, y: -6 }}
							whileTap={{ scale: 0.98 }}
						>
							<div
								className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
								style={{
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(236, 72, 153, 0.25))',
									boxShadow: '0 8px 32px rgba(139, 92, 246, 0.25)',
								}}
							>
								<span className="group-hover:scale-110 transition-transform duration-300">🎮</span>
							</div>
							<h2
								className="font-display text-3xl md:text-4xl text-white font-bold mb-3"
								style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.3)' }}
							>
								Juguemos
							</h2>
							<p
								className="text-base md:text-lg font-light mb-4"
								style={{ color: 'rgba(255, 255, 255, 0.85)', textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}
							>
								Pequeñas dinámicas para compartir. Entra y elige un juego.
							</p>
							<span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
								Entrar a juegos →
							</span>
						</motion.div>
					</Link>
				</motion.div>
			</div>
		</section>
	)
}
