# Task 3 Report

## Implemented
- Created `components/composition-chart.tsx` with a Recharts PieChart donut (CompositionChart)
  - Donut chart comparing aportes (totalInvestido) vs juros (jurosGanhos)
  - Hidden when jurosGanhos <= 0 (early return null)
  - Colors: #C4A882 (aportes), #6E8F63 (juros)
  - Legend, tooltip, percentage labels
- Modified `app/page.tsx` to import and render CompositionChart between EvolutionChart and DetailTable

## Build Results
- **Success.** Compiled successfully via Next.js (Turbopack). TypeScript check passed.

## Files Changed
- `components/composition-chart.tsx` — created (78 lines)
- `app/page.tsx` — added import and CompositionChart usage

## Self-Review
- Component matches the brief exactly
- Follows existing code style (same formatting functions, border/card pattern from evolution-chart)
- Early return when jurosGanhos <= 0 prevents showing a meaningless empty chart
- Tooltip formatter matches evolution-chart's pattern using `TooltipValueType`
- No new dependencies needed (recharts already in project)

## Issues / Concerns
- None.
