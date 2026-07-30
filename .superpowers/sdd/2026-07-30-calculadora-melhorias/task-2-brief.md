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
