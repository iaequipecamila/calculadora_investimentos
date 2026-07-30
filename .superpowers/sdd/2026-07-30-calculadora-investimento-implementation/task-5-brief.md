### Task 5: Create InvestmentForm Component

**Files:**
- Create: `components/investment-form.tsx`

**Interfaces:**
- Consumes: `useCurrencyInput` from `@/hooks/use-currency-input` (setValue unused — just use display, rawValue, onChange), `InputParams` from `@/lib/calculations`
- Produces: `<InvestmentForm onSimular: (params: InputParams) => void />`

- [ ] **Step 1: Create `components/investment-form.tsx`**

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCurrencyInput } from "@/hooks/use-currency-input"
import type { InputParams } from "@/lib/calculations"

interface InvestmentFormProps {
  onSimular: (params: InputParams) => void
}

export function InvestmentForm({ onSimular }: InvestmentFormProps) {
  const valorInicial = useCurrencyInput(0)
  const aporteMensal = useCurrencyInput(0)
  const [taxa, setTaxa] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [taxaTipo, setTaxaTipo] = useState<"ano" | "mes">("ano")

  const periodoTipo = taxaTipo === "ano" ? "anos" : "meses"

  function handleSimular() {
    const params: InputParams = {
      valorInicial: valorInicial.rawValue,
      aporteMensal: aporteMensal.rawValue,
      taxa: parseFloat(taxa.replace(",", ".")) || 0,
      taxaTipo,
      periodo: parseInt(periodo, 10) || 0,
      periodoTipo,
    }
    onSimular(params)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="valorInicial">Valor Inicial</Label>
        <Input
          id="valorInicial"
          type="text"
          inputMode="numeric"
          value={valorInicial.display}
          onChange={valorInicial.onChange}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aporteMensal">Aporte Mensal</Label>
        <Input
          id="aporteMensal"
          type="text"
          inputMode="numeric"
          value={aporteMensal.display}
          onChange={aporteMensal.onChange}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxa">Taxa de Juros</Label>
        <div className="flex items-center gap-3">
          <Input
            id="taxa"
            type="text"
            inputMode="decimal"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            placeholder="12"
            className="flex-1"
          />
          <div className="flex items-center gap-2 text-sm text-stone-500 shrink-0">
            <span className={taxaTipo === "ano" ? "text-emerald-600 font-medium" : ""}>ano</span>
            <Switch
              checked={taxaTipo === "mes"}
              onCheckedChange={(v) => setTaxaTipo(v ? "mes" : "ano")}
            />
            <span className={taxaTipo === "mes" ? "text-emerald-600 font-medium" : ""}>mês</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="periodo">
          Período ({periodoTipo})
        </Label>
        <Input
          id="periodo"
          type="text"
          inputMode="numeric"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          placeholder={periodoTipo === "anos" ? "10" : "120"}
        />
      </div>

      <Button
        onClick={handleSimular}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-base font-semibold"
      >
        Simular
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add InvestmentForm component with R$ inputs and rate toggle"
```
