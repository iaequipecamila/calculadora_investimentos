"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { TooltipValueType } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface EvolutionChartProps {
  data: { mes: number; valor: number; valorCorrigido?: number }[]
  inflacaoAtiva?: boolean
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatYAxis(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
  return value.toString()
}

const bronze = 'hsl(34, 35%, 48%)'

export function EvolutionChart({ data, inflacaoAtiva }: EvolutionChartProps) {
  const [modo, setModo] = useState<"nominal" | "corrigido">("nominal")

  if (!data || data.length === 0) return null

  const chartData = data.map((d) => ({
    mes: d.mes,
    valor: modo === "corrigido" && d.valorCorrigido ? d.valorCorrigido : d.valor,
  }))

  return (
    <div>
      {inflacaoAtiva && (
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setModo("nominal")}
            className={`text-xs px-2 py-1 rounded ${modo === "nominal" ? "bg-[#A67C4E] text-white" : "text-[#6E6558]"}`}
          >
            Nominal
          </button>
          <button
            type="button"
            onClick={() => setModo("corrigido")}
            className={`text-xs px-2 py-1 rounded ${modo === "corrigido" ? "bg-[#A67C4E] text-white" : "text-[#6E6558]"}`}
          >
            Corrigido
          </button>
        </div>
      )}
      <ChartContainer
        config={{
          valor: {
            label: "Patrimônio",
            color: bronze,
          },
        }}
        className="w-full h-72"
      >
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={bronze} stopOpacity={0.3} />
              <stop offset="95%" stopColor={bronze} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E3DCD0" />
          <XAxis
            dataKey="mes"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toString()}
            style={{ fontSize: '12px', fill: '#9A9083' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            style={{ fontSize: '12px', fill: '#9A9083' }}
            width={50}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: TooltipValueType | undefined) => formatBRL(Number(value) || 0)}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="valor"
            stroke={bronze}
            strokeWidth={2}
            fill="url(#fillValor)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
