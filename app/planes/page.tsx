'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import BackButton from '@/components/BackButton'

const generateId = () => Math.random().toString(36).substring(2, 15)

interface Plan {
	id: string
	text: string
	completed: boolean
	createdAt: number
}

const INITIAL_PLANS: Plan[] = [
	{ id: '1', text: 'Viaje a Europa', completed: false, createdAt: Date.now() },
	{ id: '2', text: 'Vivir juntos y decorar nuestro hogar', completed: false, createdAt: Date.now() - 1000 },
	{ id: '3', text: 'Tener una mascota', completed: false, createdAt: Date.now() - 2000 },
	{ id: '4', text: 'Visitar un restaurante Michelin', completed: true, createdAt: Date.now() - 3000 },
]

export default function PlanesPage() {
	const [plans, setPlans] = useState<Plan[]>([])
	const [newPlan, setNewPlan] = useState('')
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		const stored = localStorage.getItem('planes_juntos')
		if (stored) {
			try {
				const parsed = JSON.parse(stored)
				setPlans(parsed.length > 0 ? parsed : INITIAL_PLANS)
			} catch {
				setPlans(INITIAL_PLANS)
			}
		} else {
			setPlans(INITIAL_PLANS)
		}
		setIsLoaded(true)
	}, [])

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('planes_juntos', JSON.stringify(plans))
		}
	}, [plans, isLoaded])

	const addPlan = (e: React.FormEvent) => {
		e.preventDefault()
		if (!newPlan.trim()) return

		const plan: Plan = {
			id: generateId(),
			text: newPlan.trim(),
			completed: false,
			createdAt: Date.now()
		}

		setPlans([plan, ...plans])
		setNewPlan('')
	}

	const toggleCompleted = (id: string) => {
		setPlans(plans.map(p => p.id === id ? { ...p, completed: !p.completed } : p))
	}

	const deletePlan = (id: string) => {
		setPlans(plans.filter(p => p.id !== id))
	}

	const pendingPlans = plans.filter(p => !p.completed).sort((a, b) => b.createdAt - a.createdAt)
	const completedPlans = plans.filter(p => p.completed).sort((a, b) => b.createdAt - a.createdAt)

	if (!isLoaded) return null

	return (
		<ConstellationBackground>
			<BackButton label="Volver" />

			<div className="min-h-screen pt-24 pb-20 px-6 max-w-3xl mx-auto relative z-10 w-full">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12 space-y-4"
				>
					<h1 className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
						Nuestros Sueños
					</h1>
					<p className="text-white/70 max-w-lg mx-auto">
						Agrega todo lo que queremos lograr, lugares que queremos visitar y aventuras por vivir juntos.
					</p>
				</motion.div>

				<motion.form 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.1 }}
					onSubmit={addPlan} 
					className="mb-12 relative flex max-w-xl mx-auto"
				>
					<input
						type="text"
						value={newPlan}
						onChange={(e) => setNewPlan(e.target.value)}
						placeholder="Escribe un nuevo sueño..."
						className="w-full bg-white/5 border border-white/20 rounded-full py-4 pl-6 pr-16 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md"
					/>
					<button
						type="submit"
						disabled={!newPlan.trim()}
						className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:bg-white/10 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
					</button>
				</motion.form>

				<div className="space-y-12">
					{/* Por cumplir */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<h2 className="text-sm font-bold uppercase tracking-widest text-emerald-300/80 mb-6 flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
							Por Vivir ({pendingPlans.length})
						</h2>

						<div className="space-y-3">
							<AnimatePresence>
								{pendingPlans.length === 0 && (
									<motion.p 
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="text-white/40 text-center py-6 bg-white/5 rounded-2xl border border-white/5 border-dashed"
									>
										¡No hay sueños pendientes! Añadan el siguiente.
									</motion.p>
								)}
								{pendingPlans.map(plan => (
									<PlanCard key={plan.id} plan={plan} onToggle={toggleCompleted} onDelete={deletePlan} />
								))}
							</AnimatePresence>
						</div>
					</motion.div>

					{/* Cumplidos */}
					{completedPlans.length > 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
								<svg className="w-4 h-4 text-emerald-400/60" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								Sueños Cumplidos ({completedPlans.length})
							</h2>

							<div className="space-y-3">
								<AnimatePresence>
									{completedPlans.map(plan => (
										<PlanCard key={plan.id} plan={plan} onToggle={toggleCompleted} onDelete={deletePlan} />
									))}
								</AnimatePresence>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</ConstellationBackground>
	)
}

function PlanCard({ plan, onToggle, onDelete }: { plan: Plan, onToggle: (id: string) => void, onDelete: (id: string) => void }) {
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
				plan.completed 
					? 'bg-white/5 border-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
					: 'bg-white/10 border-white/10 hover:border-white/20 shadow-xl'
			}`}
		>
			<div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => onToggle(plan.id)}>
				<div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
					plan.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 group-hover:border-emerald-400'
				}`}>
					{plan.completed && (
						<svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					)}
				</div>
				<span className={`text-base sm:text-lg transition-all ${
					plan.completed ? 'text-white/40 line-through decoration-emerald-500/50' : 'text-white font-medium'
				}`}>
					{plan.text}
				</span>
			</div>

			<button
				onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
				className="opacity-0 group-hover:opacity-100 p-2 text-white/30 hover:text-rose-400 transition-colors focus:opacity-100"
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
		</motion.div>
	)
}
