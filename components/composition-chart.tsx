"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface CompositionChartProps {
  totalInvestido: number
  jurosGanhos: number
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const CORES = ["#C4A882", "#6E8F63"]

export function CompositionChart({ totalInvestido, jurosGanhos }: CompositionChartProps) {
  if (jurosGanhos <= 0) return null

  const data = [
    { name: "Aportes", value: totalInvestido },
    { name: "Juros", value: jurosGanhos },
  ]

  return (
    <div className="border p-5" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', borderRadius: '9px' }}>
      <h2 className="text-xs uppercase tracking-wide mb-3" style={{ color: '#6E6558', fontWeight: 600, letterSpacing: '0.13em' }}>
        Composição do Patrimônio
      </h2>
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
              <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CORES[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatBRL(Number(value) || 0)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-10 text-sm mt-3">
        <div className="flex items-center gap-2">
          <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', backgroundColor: '#C4A882' }} />
          <span style={{ color: '#6E6558' }}>Aportes</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', backgroundColor: '#6E8F63' }} />
          <span style={{ color: '#6E6558' }}>Juros</span>
        </div>
      </div>
    </div>
  )
}
