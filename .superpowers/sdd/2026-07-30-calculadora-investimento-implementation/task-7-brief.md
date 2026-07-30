### Task 7: Create EvolutionChart Component

**Files:**
- Create: `components/evolution-chart.tsx`

**Interfaces:**
- Consumes: shadcn Chart (Recharts wrapper), `Resultado['evolucao']`
- Produces: `<EvolutionChart data: { mes: number; valor: number }[] />`

- [ ] **Step 1: Create `components/evolution-chart.tsx`**

```tsx
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface EvolutionChartProps {
  data: { mes: number; valor: number }[]
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

export function EvolutionChart({ data }: EvolutionChartProps) {
  if (!data || data.length === 0) return null

  return (
    <ChartContainer
      config={{
        valor: {
          label: "Patrimônio",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="w-full h-72"
    >
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200" />
        <XAxis
          dataKey="mes"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v.toString()}
          className="text-xs text-stone-400"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
          className="text-xs text-stone-400"
          width={50}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value: number) => formatBRL(value)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="valor"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          fill="url(#fillValor)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add EvolutionChart component with Recharts AreaChart"
```
