# Task 2 Report: GoalSection display for aporteNecessario

## Implementation

1. **`components/sections/goal-section.tsx`**:
   - Added `aporteNecessario?: number | null` and `aporteMensalAtual?: number` to `GoalSectionProps`
   - Added `formatBRL` helper function
   - Added display logic showing aporte atual vs aporte necessário after existing meta messages

2. **`components/investment-form.tsx`**:
   - Passed `aporteNecessario={resultado?.aporteNecessario}` and `aporteMensalAtual={aporteMensal.rawValue}` to `GoalSection`

## Build

- `npm run build` → **Compiled successfully** (Turbopack, TypeScript, static pages all OK)

## Files Changed

- `components/sections/goal-section.tsx` — props interface, formatBRL helper, display logic
- `components/investment-form.tsx` — pass new props to GoalSection

## Self-review

- ✓ Props are correctly typed with optional/nullable `aporteNecessario`
- ✓ Display condition (`aporteNecessario !== undefined && aporteNecessario !== null`) guards against null/undefined
- ✓ Color coding: green when sufficient, warm tone when insufficient
- ✓ Edge cases handled: `aporteNecessario === 0` shows "Meta já atingida sem novos aportes"
- ✓ No regressions in existing functionality

## Issues

None.
