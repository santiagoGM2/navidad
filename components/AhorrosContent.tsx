'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ConstellationBackground from '@/components/ConstellationBackground'
import { useAhorroProgress } from '@/hooks/useAhorroProgress'

// recharts no es SSR-compatible → carga dinámica
const DonutChart = dynamic(() => import('@/components/ui/DonutChart'), { ssr: false })

const fmt = (n: number) =>
  '$ ' + n.toLocaleString('es-CO')

interface StatCardProps {
  label: string
  value: string
  color?: string
  delay?: number
  children?: React.ReactNode
}

function StatCard({ label, value, color = 'white', delay = 0, children }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-6 transition-colors duration-300 hover:border-[#4F46E5]"
    >
      <p className="text-xs tracking-widest uppercase mb-2 font-semibold" style={{ color: '#818CF8' }}>
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
      {children}
    </motion.div>
  )
}

export default function AhorrosContent() {
  const { data, loading } = useAhorroProgress()

  return (
    <ConstellationBackground>
      <main className="min-h-screen px-6 md:px-12 lg:px-24 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* ── HERO ───────────────────────────────────────────── */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="font-display text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ textShadow: '0 0 40px rgba(79,70,229,0.4)' }}
            >
              Nuestro Ahorro
            </h1>
            <p className="text-sm italic" style={{ color: '#818CF8' }}>
              80 días&nbsp;·&nbsp;Meta $2.000.000
            </p>

            {/* Separador decorativo */}
            <div
              className="mt-8 h-px w-full"
              style={{
                background:
                  'linear-gradient(to right, transparent, #4F46E5, transparent)',
              }}
            />
          </motion.div>

          {/* ── GRID PRINCIPAL ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* COLUMNA IZQUIERDA — stats */}
            <div className="flex flex-col gap-4">

              {/* Tarjeta 1 — META */}
              <StatCard label="Meta" value={fmt(data.meta)} delay={0}>
                <div className="mt-2 flex justify-end">
                  <svg
                    className="w-7 h-7 opacity-30"
                    style={{ color: '#818CF8' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 21V9l9-6 9 6v12M9 21V12h6v9" />
                  </svg>
                </div>
              </StatCard>

              {/* Tarjeta 2 — AHORRADO */}
              <StatCard label="Ahorrado" value={loading ? '…' : fmt(data.ahorrado)} color="#10B981" delay={0.1}>
                {/* Barra de progreso */}
                <div className="h-1 w-full rounded-full mt-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    className="h-1 rounded-full"
                    style={{ background: '#4F46E5' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(data.porcentaje, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </StatCard>

              {/* Tarjeta 3 — FALTA */}
              <StatCard label="Falta" value={loading ? '…' : fmt(data.restante)} color="#F87171" delay={0.2} />

              {/* Tarjeta 4 — DÍAS */}
              <StatCard
                label="Días completados"
                value={loading ? '…' : `${data.dias_listos} de 80`}
                delay={0.3}
              />
            </div>

            {/* COLUMNA DERECHA — Donut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8 flex flex-col items-center justify-center"
            >
              <p
                className="text-sm uppercase tracking-widest mb-6 font-semibold"
                style={{ color: '#818CF8' }}
              >
                Progreso
              </p>
              <DonutChart ahorrado={data.ahorrado} meta={data.meta} />
            </motion.div>
          </div>

          {/* ── NOTA AL PIE ────────────────────────────────────── */}
          <p
            className="text-center text-xs italic mt-12"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Se actualiza automáticamente cuando marcamos un ✓ en nuestra hoja de ahorro
          </p>

        </div>
      </main>
    </ConstellationBackground>
  )
}
