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
