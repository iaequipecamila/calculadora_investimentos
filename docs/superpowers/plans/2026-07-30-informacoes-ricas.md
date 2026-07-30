# Informações Ricas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two information-rich features: required monthly contribution for investment goals (aporte necessário) and a donut chart showing aportes vs juros composition.

**Architecture:** Pure additions to `lib/calculations.ts` (new function + interface field), one new component (`CompositionChart`), and UI updates to `GoalSection`. No structural refactoring.

**Tech Stack:** Next.js 16, React 19, Recharts (PieChart), TypeScript, Vitest.

## Global Constraints

- All currency formatting: `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- New Recharts components only if they're already in `package.json` — do not add dependencies
- Colors follow the Solimp palette: `#C4A882` (bronze claro), `#6E8F63` (verde musgo), `#C17A5A` (alerta)
- Follow existing code style: tailwind classes for layout, inline `style={}` for custom colors, no comments
- All new functions in `lib/calculations.ts` must be exported and tested

---

### Task 1: `calcularAporteNecessario` — calculation + interface + tests

**Files:**
- Modify: `lib/calculations.ts` (add function, update `Resultado` interface, update `calcular()` return)
- Test: `lib/calculations.test.ts`

**Interfaces:**
- Produces: `export function calcularAporteNecessario(valorDesejado: number, valorInicial: number, nMeses: number, taxaMensal: number): number | null`
- Produces: `Resultado.aporteNecessario?: number | null`
- Consumes: existing `InputParams`, `Resultado`, `calcular()` patterns

- [ ] **Step 1: Add `calcularAporteNecessario` to `lib/calculations.ts`**

Insert after `calcularMeta`:

```ts
export function calcularAporteNecessario(
  valorDesejado: number,
  valorInicial: number,
  nMeses: number,
  taxaMensal: number
): number | null {
  if (nMeses <= 0) return null
  if (valorInicial >= valorDesejado) return 0

  if (taxaMensal === 0) {
    const pmt = (valorDesejado - valorInicial) / nMeses
    return Math.round(pmt * 100) / 100
  }

  const fatorCrescimento = Math.pow(1 + taxaMensal, nMeses)
  if (!isFinite(fatorCrescimento)) return null

  const numerador = (valorDesejado - valorInicial * fatorCrescimento) * taxaMensal
  const denominador = fatorCrescimento - 1
  if (denominador === 0) return null

  const pmt = numerador / denominador
  if (!isFinite(pmt) || pmt < 0) return null
  return Math.round(pmt * 100) / 100
}
```

- [ ] **Step 2: Add `aporteNecessario` to `Resultado` interface**

```ts
export interface Resultado {
  ...
  mesesParaMeta?: number
  metaViavel?: boolean
  aporteNecessario?: number | null
}
```

- [ ] **Step 3: Update `calcular()` to compute `aporteNecessario`**

After the `metaViavel` block:

```ts
let aporteNecessario: number | null | undefined
if (modoMeta && valorMeta && nMeses > 0) {
  aporteNecessario = calcularAporteNecessario(valorMeta, valorInicial, nMeses, taxaMensal)
}
```

Add to return object:

```ts
return {
  ...
  mesesParaMeta,
  metaViavel,
  aporteNecessario,
}
```

- [ ] **Step 4: Write failing tests**

Add to `lib/calculations.test.ts`:

```ts
describe("calcularAporteNecessario", () => {
  it("calcula aporte necessário para atingir meta em n meses", () => {
    // PV=1000, FV=50000, n=60, r=1% → PMT ≈ 590
    const result = calcularAporteNecessario(50000, 1000, 60, 0.01)
    expect(result).toBeCloseTo(590.05, 1)
  })

  it("retorna 0 se valor inicial já >= valor desejado", () => {
    const result = calcularAporteNecessario(1000, 5000, 60, 0.01)
    expect(result).toBe(0)
  })

  it("retorna null se nMeses <= 0", () => {
    const result = calcularAporteNecessario(50000, 1000, 0, 0.01)
    expect(result).toBeNull()
  })

  it("usa divisão simples quando taxa é 0", () => {
    const result = calcularAporteNecessario(50000, 1000, 60, 0)
    expect(result).toBeCloseTo(816.67, 1)
  })

  it("retorna null se fator de crescimento é infinito", () => {
    const result = calcularAporteNecessario(1e308, 0, 1e6, 0.1)
    expect(result).toBeNull()
  })

  it("retorna null se pmt calculado for negativo (valor inicial já ultrapassa meta com juros)", () => {
    const result = calcularAporteNecessario(10000, 5000, 120, 0.01)
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run lib/calculations.test.ts
```

Expected: 1 test file, all tests pass (~15 tests total).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add calcularAporteNecessario function and Resultado.aporteNecessario"
```

---

### Task 2: GoalSection display for aporteNecessario

**Files:**
- Modify: `components/sections/goal-section.tsx`
- Modify: `components/investment-form.tsx`

**Interfaces:**
- Consumes: `GoalSectionProps.aporteNecessario?: number | null`, `GoalSectionProps.aporteMensalAtual?: number`
- Produces: Updated GoalSection with aporte mensal comparison display

- [ ] **Step 1: Add props to `GoalSection`**

```ts
interface GoalSectionProps {
  ...
  aporteNecessario?: number | null
  aporteMensalAtual?: number
}
```

- [ ] **Step 2: Add display logic after existing meta messages**

Inside the `{ativo && (` block, after the three existing `<p>` conditions:

```ts
{(aporteNecessario !== undefined && aporteNecessario !== null && mesesParaMeta !== undefined && aporteMensalAtual !== undefined) && (
  <div className="pt-2 border-t mt-2 space-y-1" style={{ borderColor: '#E3DCD0' }}>
    <p className="text-xs" style={{ color: '#9A9083' }}>
      Aporte atual: {formatBRL(aporteMensalAtual)}/mês
    </p>
    <p className="text-xs" style={{ color: aporteNecessario <= aporteMensalAtual ? '#6E8F63' : '#C17A5A' }}>
      {aporteNecessario === 0
        ? "Meta já atingida sem novos aportes"
        : aporteNecessario <= aporteMensalAtual
          ? `Aporte atual é suficiente (necessário ${formatBRL(aporteNecessario)}/mês)`
          : `Aporte necessário: ${formatBRL(aporteNecessario)}/mês para atingir em ${Math.floor(mesesParaMeta / 12)} anos e ${mesesParaMeta % 12} meses`
      }
    </p>
  </div>
)}
```

Add `formatBRL` helper at top of file (or import from a shared location — for now, define locally since other components each have their own):

```ts
function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
```

- [ ] **Step 3: Pass props from `InvestmentForm`**

In `components/investment-form.tsx`, update `GoalSection` usage:

```tsx
<GoalSection
  ...
  mesesParaMeta={resultado?.mesesParaMeta}
  metaViavel={resultado?.metaViavel}
  aporteNecessario={resultado?.aporteNecessario}
  aporteMensalAtual={aporteMensal.rawValue}
/>
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: success, no TS or lint errors.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: display aporteNecessario in GoalSection"
```

---

### Task 3: CompositionChart component + page.tsx integration

**Files:**
- Create: `components/composition-chart.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Resultado.totalInvestido`, `Resultado.jurosGanhos`
- Produces: `<CompositionChart totalInvestido={number} jurosGanhos={number} />`

- [ ] **Step 1: Create `components/composition-chart.tsx`**

```tsx
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
  const total = totalInvestido + jurosGanhos

  return (
    <div className="border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', borderRadius: '9px' }}>
      <h2 className="text-xs uppercase tracking-wide mb-3" style={{ color: '#6E6558', fontWeight: 600, letterSpacing: '0.13em' }}>
        Composição do Patrimônio
      </h2>
      <div className="flex justify-center">
        <ResponsiveContainer width={260} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name} ${((value / total) * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CORES[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatBRL(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 text-xs mt-2">
        <div className="flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block', backgroundColor: '#C4A882' }} />
          <span style={{ color: '#6E6558' }}>Aportes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block', backgroundColor: '#6E8F63' }} />
          <span style={{ color: '#6E6558' }}>Juros</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add `CompositionChart` to `page.tsx`**

Import:

```tsx
import { CompositionChart } from "@/components/composition-chart"
```

Add after `EvolutionChart` and before `DetailTable`:

```tsx
<CompositionChart
  totalInvestido={cenarioAtivo.resultado.totalInvestido}
  jurosGanhos={cenarioAtivo.resultado.jurosGanhos}
/>
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: success, no errors.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add CompositionChart donut (aportes vs juros)"
```

---

## Post-implementation

- [ ] **Self-review: Spec coverage**

Check spec requirements against implementation:
- `calcularAporteNecessario` with all edge cases → Task 1 ✓
- `Resultado.aporteNecessario` → Task 1 ✓
- GoalSection display with color-coded comparison → Task 2 ✓
- CompositionChart with donut, colors, layout → Task 3 ✓
- Integration in page.tsx → Task 3 ✓

- [ ] **Run full build**

```bash
npm run build
```
