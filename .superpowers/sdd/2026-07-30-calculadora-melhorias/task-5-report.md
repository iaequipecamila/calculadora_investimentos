# Task 5 Report: Extended Results (Cards + Chart)

**Status:** DONE

**Commits:**
- `2fb3a93` feat: extend results cards to 6 metrics and add nominal/corrigido toggle on chart

**Build summary:** Compiled successfully in 25s, TypeScript passed, no errors.

**Changes:**
- `components/results-cards.tsx` — replaced 3-card layout with 6-card grid (Total Bruto, Total Líquido, Juros Ganhos, Total Investido, IR, Valor Corrigido/Alíquota)
- `components/evolution-chart.tsx` — added nominal/corrigido toggle buttons (shown only when `inflacaoAtiva` is true), chart data switches between `valor` and `valorCorrigido` based on selected mode

**Concerns:** None.
