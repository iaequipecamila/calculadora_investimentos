### Task 5: Extended Results (Cards + Chart)

**Files:**
- Modify: `components/results-cards.tsx`
- Modify: `components/evolution-chart.tsx`

**Interfaces:**
- Consumes: `Resultado` from Task 1
- Produces: Updated `ResultsCards` (6 cards), updated `EvolutionChart` (toggle nominal/corrigido)

- [ ] **Step 1: Update `components/results-cards.tsx`**

```tsx
import type { Resultado } from "@/lib/calculations"

interface ResultsCardsProps {
  resultado: Resultado
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function ResultsCards({ resultado }: ResultsCardsProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E3DCD0',
    borderRadius: '9px',
    padding: '14px 16px',
    textAlign: 'center',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.62rem',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: '#9A9083',
    fontWeight: 600,
    marginBottom: '4px',
  }

  const showCorrigido = resultado.totalCorrigido !== resultado.totalBruto && resultado.totalCorrigido > 0

  return (
    <div className="grid grid-cols-3 gap-2">
      <div style={cardStyle}>
        <p style={labelStyle}>Total Bruto</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.1, color: '#A67C4E' }}>
          {formatBRL(resultado.totalBruto)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Líquido</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.1, color: '#6E8F63' }}>
          {formatBRL(resultado.totalLiquido)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Juros Ganhos</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#2E2A24' }}>
          {formatBRL(resultado.jurosGanhos)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Investido</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#2E2A24' }}>
          {formatBRL(resultado.totalInvestido)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>IR</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#C17A5A' }}>
          {formatBRL(resultado.totalIR)}
        </p>
        <p style={{ fontSize: '0.6rem', color: '#9A9083' }}>{resultado.aliquotaIREfetiva}% efetiva</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>{showCorrigido ? "Valor Corrigido" : "Alíquota"}</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#5A7A9A' }}>
          {showCorrigido ? formatBRL(resultado.totalCorrigido) : `${resultado.aliquotaIREfetiva}%`}
        </p>
        <p style={{ fontSize: '0.6rem', color: '#9A9083' }}>
          {showCorrigido ? "poder de compra" : "IR efetiva"}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `components/evolution-chart.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add components/results-cards.tsx components/evolution-chart.tsx
git commit -m "feat: extend results cards to 6 metrics and add nominal/corrigido toggle on chart"
```

---
