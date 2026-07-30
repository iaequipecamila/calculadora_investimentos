### Task 4: Create Currency Input Hook

**Files:**
- Create: `hooks/use-currency-input.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `useCurrencyInput(initialValue?: number): { display: string; rawValue: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; setValue: (n: number) => void }`

- [ ] **Step 1: Create `hooks/use-currency-input.ts`**

```ts
"use client"

import { useState, useCallback } from "react"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function parseCurrencyDisplay(display: string): number {
  const digits = display.replace(/\D/g, "")
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}

export function useCurrencyInput(initialValue = 0) {
  const [rawValue, setRawValue] = useState(initialValue)
  const [display, setDisplay] = useState(formatCurrency(initialValue))

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    if (!raw) {
      setDisplay("R$ 0,00")
      setRawValue(0)
      return
    }
    const num = parseInt(raw, 10) / 100
    setDisplay(formatCurrency(num))
    setRawValue(num)
  }, [])

  const setValue = useCallback((n: number) => {
    setRawValue(n)
    setDisplay(formatCurrency(n))
  }, [])

  return { display, rawValue, onChange, setValue }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add useCurrencyInput hook with R$ mask"
```
