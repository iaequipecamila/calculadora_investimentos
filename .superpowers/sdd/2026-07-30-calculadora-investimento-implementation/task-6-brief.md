### Task 6: Create ResultsCards Component

**Files:**
- Create: `components/results-cards.tsx`

**Interfaces:**
- Consumes: `Resultado` from `@/lib/calculations`
- Produces: `<ResultsCards resultado: Resultado | null />`

- [ ] **Step 1: Create `components/results-cards.tsx`**

```tsx
import { Card, CardContent } from "@/components/ui/card"
import type { Resultado } from "@/lib/calculations"

interface ResultsCardsProps {
  resultado: Resultado | null
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function ResultsCards({ resultado }: ResultsCardsProps) {
  if (!resultado) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total Bruto</p>
          <p className="text-xl font-bold text-emerald-600">
            {formatBRL(resultado.totalBruto)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total Investido</p>
          <p className="text-lg font-semibold text-stone-900">
            {formatBRL(resultado.totalInvestido)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Juros Ganhos</p>
          <p className="text-lg font-semibold text-emerald-600">
            {formatBRL(resultado.jurosGanhos)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add ResultsCards component for simulation output"
```
