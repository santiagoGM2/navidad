'use client'

import { motion } from 'framer-motion'
import { useTimeTogether } from '@/hooks/useTimeTogether'
import { RELATIONSHIP_START_DATE } from '@/constants'

export default function TimeCounter() {
	const { days, hours, minutes, seconds } = useTimeTogether(RELATIONSHIP_START_DATE)

	const timeUnits = [
		{ label: 'Días', value: days },
		{ label: 'Horas', value: hours },
		{ label: 'Minutos', value: minutes },
		{ label: 'Segundos', value: seconds },
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="relative"
		>
			{/* Fondo con contraste mejorado */}
			<div
				className="absolute -inset-6 rounded-3xl -z-10 backdrop-blur-xl"
				style={{
					background: 'linear-gradient(135deg, rgba(30, 30, 60, 0.95) 0%, rgba(20, 20, 40, 0.98) 100%)',
					boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
				}}
			/>

			<div className="relative rounded-2xl p-8 md:p-12 border border-white/10">
				{/* Título del contador - Cambiado a h2 para estructura correcta */}
				<h2
					className="font-display text-xl md:text-2xl lg:text-3xl mb-10 text-center font-semibold"
					style={{
						color: '#ffffff',
						textShadow: '0 2px 10px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.3)' // Mejor contraste
					}}
				>
					El tiempo que llevamos escribiendo esta historia...
				</h2>

				{/* Grid de números */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
					{timeUnits.map((unit, index) => (
						<motion.div
							key={unit.label}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.1, duration: 0.5 }}
							className="text-center"
						>
							{/* Contenedor del número */}
							<div className="relative">
								{/* Glow detrás del número */}
								<div
									className="absolute inset-0 rounded-xl blur-xl opacity-60"
									style={{
										background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)'
									}}
								/>

								{/* Número grande */}
								<motion.div
									key={unit.value}
									initial={{ scale: 1.05 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.15 }}
									className="relative font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-3"
									style={{
										color: '#ffffff',
										textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(99, 102, 241, 0.4)'
									}}
								>
									{unit.value.toString().padStart(2, '0')}
								</motion.div>
							</div>

							{/* Label */}
							<div
								className="text-sm md:text-base uppercase tracking-[0.2em] font-medium"
								style={{ color: '#c4b5fd' }}
							>
								{unit.label}
							</div>
						</motion.div>
					))}
				</div>

				{/* Línea decorativa */}
				<div className="mt-10 flex justify-center">
					<div
						className="w-32 h-px"
						style={{
							background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)'
						}}
					/>
				</div>

				{/* Fecha de inicio */}
				<p
					className="mt-4 text-center text-sm font-light"
					style={{ color: '#a5b4fc' }}
				>
					Desde el 6 de abril de 2025
				</p>
			</div>
		</motion.div>
	)
}

