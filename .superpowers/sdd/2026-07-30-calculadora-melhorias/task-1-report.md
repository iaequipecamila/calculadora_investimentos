# Task 1: Core de Cálculos - Report

## What Was Implemented

Replaced `lib/calculations.ts` with an extended version containing:

- **Interfaces**: `InputParams` (extended with IR/inflation/goal fields), `EvolucaoMes` (new), `Resultado` (extended)
- **Functions**: `calcularIR()`, `calcularInflacao()`, `rentabilidadeReal()`, `calcularMeta()`, `calcular()` (extended)
- **Config**: `vitest.config.mts` for vitest with `globals: true`
- **Tests**: `lib/calculations.test.ts` with 11 tests across 5 describe blocks

## TDD Evidence

### RED Phase (before implementation)
All 11 tests failed:
```
 Tests  11 failed (11)
```
- 8 failed with `TypeError: calcularIR/calcularInflacao/rentabilidadeReal/calcularMeta is not a function`
- 3 failed with `undefined` / `toBeDefined()` assertion errors on new Resultado fields

### GREEN Phase (after implementation)
All 11 tests pass:
```
 Test Files  1 passed (1)
      Tests  11 passed (11)
```

## Files Changed

| File | Status | Lines |
|------|--------|-------|
| `lib/calculations.ts` | Modified | +170 (replaced 54-line original) |
| `lib/calculations.test.ts` | Created | +104 |
| `vitest.config.mts` | Created | +5 |

## Self-Review Findings

1. **calcularIR thresholds**: The brief specified month thresholds (6, 12, 24), but the test cases pass day values (100, 730). Changed to day thresholds (180, 360, 720) matching the Brazilian IR tabela regressiva. This is the correct adaptation — the function parameter behaves as "days" to align with market convention.

2. **calcularMeta formula**: The brief's original used `Math.pow(1 + taxaMensal, 1200)` which overflows for positive rates (e.g., 1% → 1.01^1200 ≈ 153,000), making the `alvo` check always return `{0, true}` prematurely. Replaced with the correct mathematical derivation:
   - Feasibility: check if simple contributions over 1200 months can reach goal
   - Solve: `n = log((target + PMT/r) / (P + PMT/r)) / log(1+r)`
   
3. **Unused variable**: `ultimoValor` in `calcular()` is declared but never referenced (kept from brief for compatibility).

4. **No lint/typecheck issues** — Next.js project with strict TypeScript, no type errors introduced.

## Commit

```
726c119 feat: add IR, inflation, goal, and CDI calculations
```

## Test Summary

11/11 passing, output clean.

## Fix Round (2026-07-30)

### Changes Made

| Finding | Change | File:Line |
|---------|--------|-----------|
| Months vs days in `calcularIR` calls | `mes` → `mes * 30` at both call sites | `lib/calculations.ts:116,120` |
| `calcularMeta` fator sign check | `if (fator <= 0)` → `if (fator <= 1)`, return `{0, true}` | `lib/calculations.ts:84` |
| Dead variable `ultimoValor` | Deleted the unused declaration | `lib/calculations.ts:98` (removed) |
| Parameter naming `meses` → `dias` | Renamed `calcularIR` param for clarity | `lib/calculations.ts:37` |

### Tests

```
npx vitest run lib/calculations.test.ts
 Test Files  1 passed (1)
      Tests  11 passed (11)
```

### Commit

```
feat: fix IR day/month mismatch, meta fator check, dead var, param naming
```

## Concerns

None. All interfaces and functions from the brief are implemented, all tests pass, and the compute engine is ready for downstream tasks (UI, charts, etc.).
