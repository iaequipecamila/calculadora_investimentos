# Calculadora de Investimentos — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evoluir a calculadora de investimentos com IR, inflação, CDI, metas, múltiplos cenários em abas, e visualizações expandidas.

**Architecture:** Extensão modular — core de cálculos puras, seções de formulário independentes, sistema de cenários gerenciado em page.tsx. Cada camada é independente e testável.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, recharts, shadcn/ui, class-variance-authority, lucide-react

## Global Constraints

- Funções de cálculo devem ser puras (sem efeitos colaterais)
- Formatação monetária sempre em BRL com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- Tipagem explícita em todas as interfaces (não usar `any`)
- Seguir padrões de componentes existentes (shadcn/ui com `cn()` para classes)
- Paleta de cores: fundo `#F5F1EA`, texto `#2E2A24`, destaque `#A67C4E`, verde `#6E8F63`, borda `#E3DCD0`

---

### Task 1: Core de Cálculos

**Files:**
- Modify: `lib/calculations.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `InputParams`, `Resultado`, `EvolucaoMes`, `calcular()`, `calcularIR()`, `calcularInflacao()`, `rentabilidadeReal()`, `calcularMeta()`

- [ ] **Step 1: Write failing tests for new calculation functions**

Create `lib/calculations.test.ts`:

```ts
import { calcular, calcularIR, calcularInflacao, rentabilidadeReal, calcularMeta } from "./calculations"

describe("calcularIR", () => {
  it("aplica aliquota fixa de 15% sobre o lucro", () => {
    const result = calcularIR(100000, 720, 15)
    expect(result.valorIR).toBe(15000)
    expect(result.aliquota).toBe(15)
  })

  it("usa tabela regressiva quando aliquotaFixa é null", () => {
    // 100 dias → 22,5%
    const result = calcularIR(10000, 100, null)
    expect(result.aliquota).toBe(22.5)
    expect(result.valorIR).toBe(2250)
  })

  it("usa 15% para 730 dias", () => {
    const result = calcularIR(10000, 730, null)
    expect(result.aliquota).toBe(15)
    expect(result.valorIR).toBe(1500)
  })

  it("retorna 0 quando lucro é 0", () => {
    const result = calcularIR(0, 100, 15)
    expect(result.valorIR).toBe(0)
  })
})

describe("calcularInflacao", () => {
  it("corrige array de valores pela inflação mensal", () => {
    // inflação 1% ao mês
    const valores = [
      { mes: 0, valor: 1000 },
      { mes: 1, valor: 1100 },
    ]
    const result = calcularInflacao(valores, 0.01)
    expect(result[0].valorCorrigido).toBeCloseTo(1000)
    expect(result[1].valorCorrigido).toBeCloseTo(1089.11, 1)
  })
})

describe("rentabilidadeReal", () => {
  it("calcula taxa real com inflação usando fórmula de Fisher", () => {
    const result = rentabilidadeReal(0.12, 0.06)
    expect(result).toBeCloseTo(0.0566, 3)
  })
})

describe("calcularMeta", () => {
  it("retorna meses necessários para atingir a meta", () => {
    const result = calcularMeta(50000, 1000, 500, 0.01)
    expect(result.meses).toBeGreaterThan(0)
    expect(result.viavel).toBe(true)
  })

  it("retorna viavel=false se aporte é insuficiente mesmo sem prazo", () => {
    const result = calcularMeta(1_000_000, 0, 100, 0.01)
    expect(result.viavel).toBe(false)
  })
})

describe("calcular (estendido)", () => {
  it("calcula IR quando aliquota é fornecida", () => {
    const result = calcular({
      valorInicial: 10000,
      aporteMensal: 1000,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 12,
      periodoTipo: "meses",
      modoIR: "fixo",
      aliquotaIR: 15,
    })
    expect(result.totalIR).toBeGreaterThan(0)
    expect(result.totalLiquido).toBe(result.totalBruto - result.totalIR)
  })

  it("calcula inflação quando taxa é fornecida", () => {
    const result = calcular({
      valorInicial: 10000,
      aporteMensal: 1000,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 12,
      periodoTipo: "meses",
      taxaInflacao: 6,
    })
    expect(result.totalCorrigido).toBeLessThan(result.totalBruto)
  })

  it("calcula meta quando modoMeta é true", () => {
    const result = calcular({
      valorInicial: 1000,
      aporteMensal: 500,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 60,
      periodoTipo: "meses",
      modoMeta: true,
      valorMeta: 50000,
    })
    expect(result.mesesParaMeta).toBeDefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/calculations.test.ts 2>&1 || true
```

Expected: failures because functions aren't defined yet

- [ ] **Step 3: Write interfaces and implement functions**

Replace `lib/calculations.ts` content:

```ts
export interface InputParams {
  valorInicial: number
  aporteMensal: number
  taxa: number
  taxaTipo: "ano" | "mes"
  periodo: number
  periodoTipo: "anos" | "meses"
  aliquotaIR?: number
  modoIR?: "fixo" | "tabela"
  comeCotas?: boolean
  taxaInflacao?: number
  modoMeta?: boolean
  valorMeta?: number
}

export interface EvolucaoMes {
  mes: number
  valor: number
  aporte: number
  ir?: number
  valorLiquido?: number
  valorCorrigido?: number
}

export interface Resultado {
  totalBruto: number
  totalInvestido: number
  jurosGanhos: number
  evolucao: EvolucaoMes[]
  totalLiquido: number
  totalIR: number
  aliquotaIREfetiva: number
  totalCorrigido: number
  mesesParaMeta?: number
}

function calcularIR(lucro: number, meses: number, aliquotaFixa: number | null): { aliquota: number; valorIR: number } {
  if (lucro <= 0) return { aliquota: 0, valorIR: 0 }
  let aliquota: number
  if (aliquotaFixa !== null) {
    aliquota = aliquotaFixa
  } else if (meses < 6) {
    aliquota = 22.5
  } else if (meses < 12) {
    aliquota = 20
  } else if (meses < 24) {
    aliquota = 17.5
  } else {
    aliquota = 15
  }
  return { aliquota, valorIR: Math.round(lucro * aliquota) / 100 }
}

function calcularInflacao(
  valores: { mes: number; valor: number }[],
  taxaMensalInflacao: number
): { mes: number; valor: number; valorCorrigido: number }[] {
  return valores.map((item) => {
    const fatorCorrecao = Math.pow(1 + taxaMensalInflacao, item.mes)
    return { ...item, valorCorrigido: Math.round((item.valor / fatorCorrecao) * 100) / 100 }
  })
}

function rentabilidadeReal(taxaNominal: number, taxaInflacao: number): number {
  return (1 + taxaNominal) / (1 + taxaInflacao) - 1
}

function calcularMeta(
  valorDesejado: number,
  valorInicial: number,
  aporteMensal: number,
  taxaMensal: number
): { meses: number; viavel: boolean } {
  if (taxaMensal === 0) {
    if (aporteMensal <= 0) return { meses: 0, viavel: false }
    const meses = Math.ceil((valorDesejado - valorInicial) / aporteMensal)
    return { meses: Math.max(0, meses), viavel: true }
  }
  const alvo = valorDesejado - valorInicial * Math.pow(1 + taxaMensal, 1200)
  if (alvo <= 0) return { meses: 0, viavel: true }
  const pmt = aporteMensal * ((Math.pow(1 + taxaMensal, 1200) - 1) / taxaMensal)
  if (pmt <= 0) return { meses: 0, viavel: false }
  const n = Math.log(1 + (alvo * taxaMensal) / aporteMensal) / Math.log(1 + taxaMensal)
  if (!isFinite(n)) return { meses: 0, viavel: false }
  return { meses: Math.ceil(n), viavel: true }
}

export function calcular(params: InputParams): Resultado {
  const { valorInicial, aporteMensal, taxa, taxaTipo, periodo, periodoTipo, aliquotaIR, modoIR, comeCotas, taxaInflacao, modoMeta, valorMeta } = params

  const taxaDecimal = taxa / 100
  const taxaMensal = taxaTipo === "ano" ? Math.pow(1 + taxaDecimal, 1 / 12) - 1 : taxaDecimal
  const nMeses = periodoTipo === "anos" ? periodo * 12 : periodo

  const evolucao: EvolucaoMes[] = []
  let ultimoValor = valorInicial

  for (let mes = 0; mes <= nMeses; mes++) {
    let valor: number
    if (taxaMensal === 0) {
      valor = valorInicial + aporteMensal * mes
    } else {
      valor =
        valorInicial * Math.pow(1 + taxaMensal, mes) +
        aporteMensal * ((Math.pow(1 + taxaMensal, mes) - 1) / taxaMensal)
    }

    const aporte = mes === 0 ? 0 : aporteMensal

    let ir = 0
    let valorLiquido: number | undefined

    if (aliquotaIR !== undefined || modoIR === "tabela" || modoIR === "fixo") {
      const lucroAcumulado = valor - (valorInicial + aporteMensal * mes)
      if (comeCotas && mes > 0 && mes % 6 === 0 && lucroAcumulado > 0) {
        const result = calcularIR(lucroAcumulado, mes, aliquotaIR ?? null)
        ir = result.valorIR
        valorLiquido = valor - ir
      } else if (mes === nMeses && lucroAcumulado > 0) {
        const result = calcularIR(lucroAcumulado, mes, aliquotaIR ?? null)
        ir = result.valorIR
        valorLiquido = valor - ir
      }
    }

    evolucao.push({ mes, valor: Math.round(valor * 100) / 100, aporte, ir, valorLiquido })
  }

  const totalBruto = evolucao[nMeses].valor
  const totalInvestido = Math.round((valorInicial + aporteMensal * nMeses) * 100) / 100
  const jurosGanhos = Math.round((totalBruto - totalInvestido) * 100) / 100

  let totalIR = 0
  for (const e of evolucao) {
    totalIR += e.ir ?? 0
  }
  totalIR = Math.round(totalIR * 100) / 100
  const totalLiquido = Math.round((totalBruto - totalIR) * 100) / 100

  const aliquotaIREfetiva = totalIR > 0 && jurosGanhos > 0 ? Math.round((totalIR / jurosGanhos) * 10000) / 100 : 0

  let totalCorrigido = totalBruto
  if (taxaInflacao) {
    const inflacaoMensal = Math.pow(1 + taxaInflacao / 100, 1 / 12) - 1
    const corrigidos = calcularInflacao(evolucao.map((e) => ({ mes: e.mes, valor: e.valor })), inflacaoMensal)
    for (let i = 0; i < evolucao.length; i++) {
      evolucao[i].valorCorrigido = corrigidos[i].valorCorrigido
    }
    totalCorrigido = Math.round((totalBruto / Math.pow(1 + inflacaoMensal, nMeses)) * 100) / 100
  }

  let mesesParaMeta: number | undefined
  if (modoMeta && valorMeta) {
    mesesParaMeta = calcularMeta(valorMeta, valorInicial, aporteMensal, taxaMensal).meses
  }

  return {
    totalBruto,
    totalInvestido,
    jurosGanhos,
    evolucao,
    totalLiquido,
    totalIR,
    aliquotaIREfetiva,
    totalCorrigido,
    mesesParaMeta,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/calculations.test.ts
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/calculations.ts lib/calculations.test.ts
git commit -m "feat: add IR, inflation, goal, and CDI calculations"
```

---

### Task 2: Form Sections (Basic, IR, Inflation, Goal)

**Files:**
- Create: `components/sections/basic-section.tsx`
- Create: `components/sections/ir-section.tsx`
- Create: `components/sections/inflation-section.tsx`
- Create: `components/sections/goal-section.tsx`

**Interfaces:**
- Consumes: `InputParams` from Task 1
- Produces: Section components that accept `value`/`onChange` props

Each section is a self-contained component with local state and callbacks.

- [ ] **Step 1: Create `components/sections/basic-section.tsx`**

```tsx
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCurrencyInput } from "@/hooks/use-currency-input"

interface BasicSectionProps {
  valorInicial: { display: string; rawValue: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
  aporteMensal: { display: string; rawValue: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
  taxa: string
  onTaxaChange: (v: string) => void
  taxaTipo: "ano" | "mes"
  onTaxaTipoChange: (v: "ano" | "mes") => void
  periodo: string
  onPeriodoChange: (v: string) => void
}

export function BasicSection({ valorInicial, aporteMensal, taxa, onTaxaChange, taxaTipo, onTaxaTipoChange, periodo, onPeriodoChange }: BasicSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="valorInicial">Valor Inicial</Label>
        <Input id="valorInicial" type="text" inputMode="numeric" value={valorInicial.display} onChange={valorInicial.onChange} placeholder="R$ 0,00" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aporteMensal">Aporte Mensal</Label>
        <Input id="aporteMensal" type="text" inputMode="numeric" value={aporteMensal.display} onChange={aporteMensal.onChange} placeholder="R$ 0,00" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taxa">Taxa de Juros</Label>
        <div className="flex items-center gap-3">
          <Input id="taxa" type="text" inputMode="decimal" value={taxa} onChange={(e) => onTaxaChange(e.target.value)} placeholder="12" className="flex-1" />
          <div className="flex items-center gap-2 text-sm shrink-0" style={{ color: '#6E6558' }}>
            <span className="font-medium" style={{ color: taxaTipo === "ano" ? '#A67C4E' : '#6E6558' }}>ano</span>
            <Switch checked={taxaTipo === "mes"} onCheckedChange={(v) => onTaxaTipoChange(v ? "mes" : "ano")} />
            <span className="font-medium" style={{ color: taxaTipo === "mes" ? '#A67C4E' : '#6E6558' }}>mês</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="periodo">Período ({taxaTipo === "ano" ? "anos" : "meses"})</Label>
        <Input id="periodo" type="text" inputMode="numeric" value={periodo} onChange={(e) => onPeriodoChange(e.target.value)} placeholder={taxaTipo === "ano" ? "10" : "120"} />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create `components/sections/ir-section.tsx`**

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface IrSectionProps {
  aliquotaIR: string
  onAliquotaIRChange: (v: string) => void
  modoIR: "fixo" | "tabela"
  onModoIRChange: (v: "fixo" | "tabela") => void
  comeCotas: boolean
  onComeCotasChange: (v: boolean) => void
}

export function IrSection({ aliquotaIR, onAliquotaIRChange, modoIR, onModoIRChange, comeCotas, onComeCotasChange }: IrSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4" style={{ borderColor: '#E3DCD0' }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-semibold" style={{ color: '#2E2A24' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▶</span>
        Imposto de Renda
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onModoIRChange("tabela")}
              className={`px-3 py-1.5 text-xs rounded-md border ${modoIR === "tabela" ? "border-[#A67C4E] bg-[#A67C4E]/10 text-[#A67C4E]" : "border-[#E3DCD0] text-[#6E6558]"}`}
            >
              Tabela Regressiva
            </button>
            <button
              type="button"
              onClick={() => onModoIRChange("fixo")}
              className={`px-3 py-1.5 text-xs rounded-md border ${modoIR === "fixo" ? "border-[#A67C4E] bg-[#A67C4E]/10 text-[#A67C4E]" : "border-[#E3DCD0] text-[#6E6558]"}`}
            >
              Alíquota Fixa
            </button>
          </div>
          {modoIR === "fixo" && (
            <div className="space-y-2">
              <Label htmlFor="aliquotaIR">Alíquota (%)</Label>
              <Input id="aliquotaIR" type="text" inputMode="decimal" value={aliquotaIR} onChange={(e) => onAliquotaIRChange(e.target.value)} placeholder="15" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch id="comeCotas" checked={comeCotas} onCheckedChange={onComeCotasChange} />
            <Label htmlFor="comeCotas" className="text-sm">Come-cotas semestrais (fundos)</Label>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/sections/inflation-section.tsx`**

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface InflationSectionProps {
  taxaInflacao: string
  onTaxaInflacaoChange: (v: string) => void
  ativo: boolean
  onAtivoChange: (v: boolean) => void
}

export function InflationSection({ taxaInflacao, onTaxaInflacaoChange, ativo, onAtivoChange }: InflationSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4" style={{ borderColor: '#E3DCD0' }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-semibold" style={{ color: '#2E2A24' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▶</span>
        Inflação
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Switch id="inflacaoAtivo" checked={ativo} onCheckedChange={onAtivoChange} />
            <Label htmlFor="inflacaoAtivo" className="text-sm">Corrigir pela inflação</Label>
          </div>
          {ativo && (
            <div className="space-y-2">
              <Label htmlFor="taxaInflacao">IPCA estimado (% ao ano)</Label>
              <Input id="taxaInflacao" type="text" inputMode="decimal" value={taxaInflacao} onChange={(e) => onTaxaInflacaoChange(e.target.value)} placeholder="6" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `components/sections/goal-section.tsx`**

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCurrencyInput } from "@/hooks/use-currency-input"

interface GoalSectionProps {
  valorMeta: { display: string; rawValue: number }
  onValorMetaChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ativo: boolean
  onAtivoChange: (v: boolean) => void
  mesesParaMeta?: number
}

export function GoalSection({ valorMeta, onValorMetaChange, ativo, onAtivoChange, mesesParaMeta }: GoalSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4" style={{ borderColor: '#E3DCD0' }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-semibold" style={{ color: '#2E2A24' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▶</span>
        Meta de Investimento
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Switch id="metaAtivo" checked={ativo} onCheckedChange={onAtivoChange} />
            <Label htmlFor="metaAtivo" className="text-sm">Definir meta</Label>
          </div>
          {ativo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="valorMeta">Valor desejado</Label>
                <Input id="valorMeta" type="text" inputMode="numeric" value={valorMeta.display} onChange={onValorMetaChange} placeholder="R$ 0,00" />
              </div>
              {mesesParaMeta !== undefined && (
                <p className="text-sm font-medium" style={{ color: '#6E8F63' }}>
                  Meta atingida em {Math.floor(mesesParaMeta / 12)} anos e {mesesParaMeta % 12} meses
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/sections/
git commit -m "feat: add collapsible form sections for IR, inflation, and goals"
```

---

### Task 3: Refactor InvestmentForm

**Files:**
- Modify: `components/investment-form.tsx`

**Interfaces:**
- Consumes: Sections from Task 2, `InputParams` from Task 1
- Produces: `InvestmentForm` component accepting `params: InputParams`, `resultado?: Resultado`, `onSimular: (params: InputParams) => void`

- [ ] **Step 1: Rewrite `components/investment-form.tsx`**

```tsx
"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { BasicSection } from "@/components/sections/basic-section"
import { IrSection } from "@/components/sections/ir-section"
import { InflationSection } from "@/components/sections/inflation-section"
import { GoalSection } from "@/components/sections/goal-section"
import { useCurrencyInput } from "@/hooks/use-currency-input"
import type { InputParams, Resultado } from "@/lib/calculations"

interface InvestmentFormProps {
  onSimular: (params: InputParams) => void
  resultado?: Resultado | null
}

export function InvestmentForm({ onSimular, resultado }: InvestmentFormProps) {
  const valorInicial = useCurrencyInput(0)
  const aporteMensal = useCurrencyInput(0)
  const valorMeta = useCurrencyInput(0)
  const [taxa, setTaxa] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [taxaTipo, setTaxaTipo] = useState<"ano" | "mes">("ano")
  const [modoIR, setModoIR] = useState<"fixo" | "tabela">("tabela")
  const [aliquotaIR, setAliquotaIR] = useState("")
  const [comeCotas, setComeCotas] = useState(false)
  const [inflacaoAtiva, setInflacaoAtiva] = useState(false)
  const [taxaInflacao, setTaxaInflacao] = useState("")
  const [metaAtiva, setMetaAtiva] = useState(false)

  const periodoTipo = taxaTipo === "ano" ? "anos" : "meses"

  const handleSimular = useCallback(() => {
    const params: InputParams = {
      valorInicial: valorInicial.rawValue,
      aporteMensal: aporteMensal.rawValue,
      taxa: parseFloat(taxa.replace(",", ".")) || 0,
      taxaTipo,
      periodo: parseInt(periodo, 10) || 0,
      periodoTipo,
      ...(modoIR === "tabela" ? { modoIR: "tabela" as const, comeCotas } : { modoIR: "fixo" as const, aliquotaIR: parseFloat(aliquotaIR.replace(",", ".")) || 0, comeCotas }),
      ...(inflacaoAtiva && parseFloat(taxaInflacao) > 0 ? { taxaInflacao: parseFloat(taxaInflacao.replace(",", ".")) } : {}),
      ...(metaAtiva && valorMeta.rawValue > 0 ? { modoMeta: true as const, valorMeta: valorMeta.rawValue } : {}),
    }
    onSimular(params)
  }, [valorInicial.rawValue, aporteMensal.rawValue, taxa, taxaTipo, periodo, periodoTipo, modoIR, aliquotaIR, comeCotas, inflacaoAtiva, taxaInflacao, metaAtiva, valorMeta.rawValue, onSimular])

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <BasicSection
          valorInicial={valorInicial}
          aporteMensal={aporteMensal}
          taxa={taxa}
          onTaxaChange={setTaxa}
          taxaTipo={taxaTipo}
          onTaxaTipoChange={setTaxaTipo}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
        />
      </div>

      <IrSection
        aliquotaIR={aliquotaIR}
        onAliquotaIRChange={setAliquotaIR}
        modoIR={modoIR}
        onModoIRChange={setModoIR}
        comeCotas={comeCotas}
        onComeCotasChange={setComeCotas}
      />

      <InflationSection
        taxaInflacao={taxaInflacao}
        onTaxaInflacaoChange={setTaxaInflacao}
        ativo={inflacaoAtiva}
        onAtivoChange={setInflacaoAtiva}
      />

      <GoalSection
        valorMeta={valorMeta}
        onValorMetaChange={valorMeta.onChange}
        ativo={metaAtiva}
        onAtivoChange={setMetaAtiva}
        mesesParaMeta={resultado?.mesesParaMeta}
      />

      <Button
        onClick={handleSimular}
        className="w-full h-12 text-base font-semibold hover:opacity-85"
        style={{ backgroundColor: '#A67C4E', color: '#FFFFFF' }}
      >
        Simular
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript or build errors

- [ ] **Step 3: Commit**

```bash
git add components/investment-form.tsx
git commit -m "refactor: integrate collapsible form sections into InvestmentForm"
```

---

### Task 4: Scenario Tabs

**Files:**
- Create: `components/scenario-tabs.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `InputParams`, `Resultado`, `InvestmentForm`
- Produces: Scenario tab system with state management

- [ ] **Step 1: Create `components/scenario-tabs.tsx`**

```tsx
"use client"

import type { ReactNode } from "react"

interface ScenarioTab {
  id: string
  nome: string
}

interface ScenarioTabsProps {
  tabs: ScenarioTab[]
  ativo: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  onRename: (id: string, nome: string) => void
  children: (tab: ScenarioTab) => ReactNode
}

export function ScenarioTabs({ tabs, ativo, onSelect, onAdd, onRemove, children }: ScenarioTabsProps) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-4 overflow-x-auto" style={{ borderBottom: '2px solid #E3DCD0' }}>
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-t-md transition-colors ${
                tab.id === ativo
                  ? "bg-white border-x border-t"
                  : "text-[#9A9083] hover:text-[#2E2A24]"
              }`}
              style={{
                borderColor: tab.id === ativo ? '#E3DCD0' : 'transparent',
                color: tab.id === ativo ? '#A67C4E' : undefined,
                borderBottom: tab.id === ativo ? '2px solid white' : undefined,
                marginBottom: '-2px',
              }}
            >
              {tab.nome}
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(tab.id)}
                className="p-1 text-[#9A9083] hover:text-[#C17A5A] text-xs"
                aria-label={`Remover ${tab.nome}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 text-sm text-[#9A9083] hover:text-[#A67C4E] shrink-0"
          aria-label="Adicionar cenário"
        >
          + Novo
        </button>
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} style={{ display: tab.id === ativo ? 'block' : 'none' }}>
          {children(tab)}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx` with scenario management**

```tsx
"use client"

import { useState, useCallback } from "react"
import { InvestmentForm } from "@/components/investment-form"
import { ResultsCards } from "@/components/results-cards"
import { EvolutionChart } from "@/components/evolution-chart"
import { ScenarioTabs } from "@/components/scenario-tabs"
import { DetailTable } from "@/components/detail-table"
import { calcular } from "@/lib/calculations"
import type { InputParams, Resultado } from "@/lib/calculations"

interface CenarioState {
  id: string
  nome: string
  resultado: Resultado | null
}

let nextId = 2

export default function Home() {
  const [cenarios, setCenarios] = useState<CenarioState[]>([
    { id: "1", nome: "Cenário 1", resultado: null },
  ])
  const [ativo, setAtivo] = useState("1")

  const handleSimular = useCallback((params: InputParams) => {
    const res = calcular(params)
    setCenarios((prev) => prev.map((c) => (c.id === ativo ? { ...c, resultado: res } : c)))
  }, [ativo])

  const handleAdd = useCallback(() => {
    const id = String(nextId++)
    setCenarios((prev) => [...prev, { id, nome: `Cenário ${id}`, resultado: null }])
    setAtivo(id)
  }, [])

  const handleRemove = useCallback((id: string) => {
    setCenarios((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (ativo === id && next.length > 0) setAtivo(next[next.length - 1].id)
      return next
    })
  }, [ativo])

  const handleRename = useCallback((id: string, nome: string) => {
    setCenarios((prev) => prev.map((c) => (c.id === id ? { ...c, nome } : c)))
  }, [])

  const cenarioAtivo = cenarios.find((c) => c.id === ativo)

  return (
    <main className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F1EA' }}>
      <div className="max-w-[480px] mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-center" style={{ fontFamily: 'var(--font-fraunces)', color: '#2E2A24' }}>
          Calculadora de <em style={{ color: '#8A6340', fontStyle: 'italic' }}>Investimentos</em>
        </h1>

        <ScenarioTabs
          tabs={cenarios.map(({ id, nome }) => ({ id, nome }))}
          ativo={ativo}
          onSelect={setAtivo}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onRename={handleRename}
        >
          {() => (
            <div className="space-y-5">
              <InvestmentForm onSimular={handleSimular} resultado={cenarioAtivo?.resultado} />
              {cenarioAtivo?.resultado && (
                <>
                  <ResultsCards resultado={cenarioAtivo.resultado} />
                  <div className="border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', borderRadius: '9px' }}>
                    <h2 className="text-xs uppercase tracking-wide mb-3" style={{ color: '#6E6558', fontWeight: 600, letterSpacing: '0.13em' }}>
                      Evolução do Patrimônio
                    </h2>
                    <EvolutionChart data={cenarioAtivo.resultado.evolucao} inflacaoAtiva={!!cenarioAtivo.resultado.totalCorrigido} />
                  </div>
                  <DetailTable evolucao={cenarioAtivo.resultado.evolucao} inflacaoAtiva={!!cenarioAtivo.resultado.totalCorrigido} />
                </>
              )}
            </div>
          )}
        </ScenarioTabs>
      </div>
    </main>
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
git add components/scenario-tabs.tsx app/page.tsx
git commit -m "feat: add multi-scenario tab system"
```

---

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

### Task 6: Detail Table

**Files:**
- Create: `components/detail-table.tsx`

**Interfaces:**
- Consumes: `EvolucaoMes[]` from Task 1
- Produces: `DetailTable` component

- [ ] **Step 1: Create `components/detail-table.tsx`**

```tsx
import type { EvolucaoMes } from "@/lib/calculations"

interface DetailTableProps {
  evolucao: EvolucaoMes[]
  inflacaoAtiva?: boolean
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function DetailTable({ evolucao, inflacaoAtiva }: DetailTableProps) {
  if (!evolucao || evolucao.length === 0) return null

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E3DCD0', backgroundColor: '#FFFFFF' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: '#F5F1EA', borderBottom: '1px solid #E3DCD0' }}>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: '#6E6558' }}>Mês</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: '#6E6558' }}>Saldo Bruto</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: '#6E6558' }}>Aporte</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: '#6E6558' }}>IR</th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: '#6E6558' }}>Saldo Líquido</th>
              {inflacaoAtiva && (
                <th className="px-3 py-2 text-right font-semibold" style={{ color: '#6E6558' }}>Saldo Corrigido</th>
              )}
            </tr>
          </thead>
          <tbody>
            {evolucao.map((item, i) => (
              <tr
                key={item.mes}
                style={{
                  borderBottom: '1px solid #E3DCD0',
                  backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAF8F5',
                }}
              >
                <td className="px-3 py-1.5 text-left font-medium" style={{ color: '#2E2A24' }}>{item.mes}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: '#2E2A24' }}>{formatBRL(item.valor)}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: '#6E6558' }}>{formatBRL(item.aporte)}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: item.ir && item.ir > 0 ? '#C17A5A' : '#6E6558' }}>{item.ir ? formatBRL(item.ir) : "—"}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: '#2E2A24' }}>
                  {item.valorLiquido ? formatBRL(item.valorLiquido) : "—"}
                </td>
                {inflacaoAtiva && (
                  <td className="px-3 py-1.5 text-right" style={{ color: '#5A7A9A' }}>
                    {item.valorCorrigido ? formatBRL(item.valorCorrigido) : "—"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/detail-table.tsx
git commit -m "feat: add month-by-month detail table"
```

---

### Task 7: Integration Test & Final Verification

**Files:**
- No file changes — verification pass

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: successful build with no TypeScript or lint errors

- [ ] **Step 2: Manual smoke test checklist**

Run `npm run dev` and verify:
- [ ] Form shows Basic, IR, Inflation, and Meta sections
- [ ] Sections collapse/expand
- [ ] IR toggle between tabela regressiva and aliquota fixa
- [ ] Inflação toggle shows/hides IPCA input
- [ ] Meta toggle shows/hides valor desejado input
- [ ] Simular button produces results
- [ ] 6 result cards displayed
- [ ] Chart renders with toggle nominal/corrigido when inflation active
- [ ] Detail table renders with correct columns
- [ ] + Novo tab creates a new scenario
- [ ] Tabs switch between scenarios independently
- [ ] × removes scenario correctly

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final adjustments after integration"
```
