'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import { useAhorroProgress } from '@/hooks/useAhorroProgress'

// recharts no es SSR-compatible → carga dinámica
const DonutChart = dynamic(() => import('@/components/ui/DonutChart'), { ssr: false })

const fmt = (n: number) => '$ ' + n.toLocaleString('es-CO')

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color?: string
  delay?: number
  children?: React.ReactNode
}

function StatCard({ label, value, icon, color = 'white', delay = 0, children }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-sm p-6 transition-all duration-300 group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* hover border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: '1px solid rgba(79,70,229,0.5)', boxShadow: 'inset 0 0 20px rgba(79,70,229,0.05)' }}
      />
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: '#818CF8' }}>
          {label}
        </p>
        <div className="opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: '#818CF8' }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold leading-none" style={{ color }}>
        {value}
      </p>
      {children}
    </motion.div>
  )
}

export default function AhorrosContent() {
  const { data, loading } = useAhorroProgress()

  const diasRestantes = Math.max(80 - data.dias_listos, 0)

  return (
    <ConstellationBackground>
      <main className="min-h-screen px-6 md:px-12 lg:px-24 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(79,70,229,0.15)',
                border: '1px solid rgba(79,70,229,0.35)',
                color: '#818CF8',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              Nuestro gran sueño
            </motion.div>

            <h1
              className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ textShadow: '0 0 60px rgba(79,70,229,0.5)' }}
            >
              Nos vamos para
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #818CF8 0%, #C4B5FD 50%, #A5B4FC 100%)',
                }}
              >
                Europa
              </span>
            </h1>
            <p className="text-base md:text-lg font-light max-w-md mx-auto leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              80 días de disciplina, un vuelo de amor. Cada peso ahorrado es un paso más cerca del viaje de nuestras vidas.
            </p>

            {/* Separador */}
            <div
              className="mt-10 h-px w-full"
              style={{ background: 'linear-gradient(to right, transparent, #4F46E5, transparent)' }}
            />
          </motion.div>

          {/* ── GRID PRINCIPAL ──────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* COLUMNA IZQUIERDA — stats */}
            <div className="flex flex-col gap-4">

              {/* META */}
              <StatCard
                label="Meta del viaje"
                value={fmt(data.meta)}
                delay={0}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                }
              />

              {/* AHORRADO */}
              <StatCard
                label="Ya tenemos"
                value={loading ? '…' : fmt(data.ahorrado)}
                color="#10B981"
                delay={0.1}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                {/* Barra de progreso */}
                <div className="h-1 w-full rounded-full mt-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, #4F46E5, #10B981)',
                      boxShadow: '0 0 8px rgba(16,185,129,0.5)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(data.porcentaje, 100)}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </StatCard>

              {/* FALTA */}
              <StatCard
                label="Nos falta"
                value={loading ? '…' : fmt(data.restante)}
                color="#F87171"
                delay={0.2}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              {/* DÍAS */}
              <StatCard
                label="Días completados"
                value={loading ? '…' : `${data.dias_listos} de 80`}
                delay={0.3}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              >
                <p className="text-xs mt-2" style={{ color: 'rgba(129,140,248,0.7)' }}>
                  {diasRestantes === 0
                    ? 'Objetivo completado — a empacar!'
                    : `${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restante${diasRestantes !== 1 ? 's' : ''} para el destino`}
                </p>
              </StatCard>
            </div>

            {/* COLUMNA DERECHA — Donut + mensaje */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Donut card */}
              <div
                className="rounded-2xl backdrop-blur-sm p-8 flex flex-col items-center justify-center flex-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-xs uppercase tracking-[0.25em] mb-6 font-semibold" style={{ color: '#818CF8' }}>
                  Avance hacia Europa
                </p>
                <DonutChart ahorrado={data.ahorrado} meta={data.meta} />
              </div>

              {/* Destino inspiracional */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="rounded-2xl p-6 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(30,27,75,0.4) 100%)',
                  border: '1px solid rgba(79,70,229,0.3)',
                }}
              >
                <p className="text-2xl font-bold text-white mb-1">
                  Santi &amp; Tefa
                </p>
                <p className="text-sm font-light" style={{ color: 'rgba(129,140,248,0.8)' }}>
                  rumbo a Europa, juntos
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* ── NOTA AL PIE ──────────────────────────────────────── */}
          <p
            className="text-center text-xs mt-12 font-light tracking-wide"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Cada marca en la hoja actualiza esta página al instante
          </p>

        </div>
      </main>
    </ConstellationBackground>
  )
}
