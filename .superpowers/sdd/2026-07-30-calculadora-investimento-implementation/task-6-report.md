# Task 6 Report: ResultsCards Component

**Status:** ✅ Complete

**Files created:**
- `components/results-cards.tsx`

**Implementation details:**
- Functional component consuming `Resultado` type from `@/lib/calculations`
- Renders 3 cards in a responsive grid (1 col mobile, 3 col sm+)
- Cards: Total Bruto (emerald, bold), Total Investido (stone, semibold), Juros Ganhos (emerald, semibold)
- Formatting via `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- Returns `null` when `resultado` is null

**Build:** ✅ `npm run build` — compiled successfully

**Commit:** `74cf301` — `feat: add ResultsCards component for simulation output`
