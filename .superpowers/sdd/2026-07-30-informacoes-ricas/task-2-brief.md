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

Add `formatBRL` helper at top of file (define locally since other components each have their own):

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
