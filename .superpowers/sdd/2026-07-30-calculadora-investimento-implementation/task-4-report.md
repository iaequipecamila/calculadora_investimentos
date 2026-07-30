# Task 4 Report: Create Currency Input Hook

**Status:** DONE

**Created files:**
- `hooks/use-currency-input.ts` — custom React hook with R$ currency mask via `Intl.NumberFormat("pt-BR")`, returning `{ display, rawValue, onChange, setValue }`

**Verification:**
- File compiles with `tsc --noEmit` (no errors)

**Commits:**
- `3a6965e` feat: add useCurrencyInput hook with R$ mask
