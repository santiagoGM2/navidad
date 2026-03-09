'use client'

import { PieChart, Pie, Cell } from 'recharts'

interface DonutChartProps {
  ahorrado: number
  meta: number
}

export default function DonutChart({ ahorrado, meta }: DonutChartProps) {
  const restante = Math.max(meta - ahorrado, 0)
  const porcentaje = meta > 0 ? ((ahorrado / meta) * 100).toFixed(1) : '0.0'

  const data = [
    { name: 'Ahorrado', value: ahorrado || 0.001 }, // tiny value so chart renders even at 0
    { name: 'Restante', value: restante || 0.001 }
  ]

  return (
    <div className="relative w-full" style={{ aspectRatio: '1 / 1', maxWidth: 220, margin: '0 auto' }}>
      <PieChart width={220} height={220}>
        <Pie
          data={data}
          cx={110}
          cy={110}
          innerRadius={70}
          outerRadius={90}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          stroke="none"
        >
          <Cell fill="#4F46E5" />
          <Cell fill="#1E1B4B" />
        </Pie>
      </PieChart>

      {/* Centro del donut */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <span
          className="text-3xl font-bold text-white leading-none"
          style={{ textShadow: '0 0 20px rgba(79,70,229,0.5)' }}
        >
          {porcentaje}%
        </span>
        <span className="text-xs mt-1 font-medium" style={{ color: '#818CF8' }}>
          completado
        </span>
      </div>
    </div>
  )
}
