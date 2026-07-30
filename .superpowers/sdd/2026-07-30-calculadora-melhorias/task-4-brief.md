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
