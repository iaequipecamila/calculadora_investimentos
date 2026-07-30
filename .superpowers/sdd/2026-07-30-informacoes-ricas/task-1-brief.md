### Task 1: `calcularAporteNecessario` — calculation + interface + tests

**Files:**
- Modify: `lib/calculations.ts` (add function, update `Resultado` interface, update `calcular()` return)
- Test: `lib/calculations.test.ts`

**Interfaces:**
- Produces: `export function calcularAporteNecessario(valorDesejado: number, valorInicial: number, nMeses: number, taxaMensal: number): number | null`
- Produces: `Resultado.aporteNecessario?: number | null`
- Consumes: existing `InputParams`, `Resultado`, `calcular()` patterns

- [ ] **Step 1: Add `calcularAporteNecessario` to `lib/calculations.ts`**

Insert after `calcularMeta`:

```ts
export function calcularAporteNecessario(
  valorDesejado: number,
  valorInicial: number,
  nMeses: number,
  taxaMensal: number
): number | null {
  if (nMeses <= 0) return null
  if (valorInicial >= valorDesejado) return 0

  if (taxaMensal === 0) {
    const pmt = (valorDesejado - valorInicial) / nMeses
    return Math.round(pmt * 100) / 100
  }

  const fatorCrescimento = Math.pow(1 + taxaMensal, nMeses)
  if (!isFinite(fatorCrescimento)) return null

  const numerador = (valorDesejado - valorInicial * fatorCrescimento) * taxaMensal
  const denominador = fatorCrescimento - 1
  if (denominador === 0) return null

  const pmt = numerador / denominador
  if (!isFinite(pmt) || pmt < 0) return null
  return Math.round(pmt * 100) / 100
}
```

- [ ] **Step 2: Add `aporteNecessario` to `Resultado` interface**

```ts
export interface Resultado {
  ...
  mesesParaMeta?: number
  metaViavel?: boolean
  aporteNecessario?: number | null
}
```

- [ ] **Step 3: Update `calcular()` to compute `aporteNecessario`**

After the `metaViavel` block:

```ts
let aporteNecessario: number | null | undefined
if (modoMeta && valorMeta && nMeses > 0) {
  aporteNecessario = calcularAporteNecessario(valorMeta, valorInicial, nMeses, taxaMensal)
}
```

Add to return object:

```ts
return {
  ...
  mesesParaMeta,
  metaViavel,
  aporteNecessario,
}
```

- [ ] **Step 4: Write failing tests**

Add to `lib/calculations.test.ts`:

```ts
describe("calcularAporteNecessario", () => {
  it("calcula aporte necessário para atingir meta em n meses", () => {
    // PV=1000, FV=50000, n=60, r=1% → PMT ≈ 590
    const result = calcularAporteNecessario(50000, 1000, 60, 0.01)
    expect(result).toBeCloseTo(590.05, 1)
  })

  it("retorna 0 se valor inicial já >= valor desejado", () => {
    const result = calcularAporteNecessario(1000, 5000, 60, 0.01)
    expect(result).toBe(0)
  })

  it("retorna null se nMeses <= 0", () => {
    const result = calcularAporteNecessario(50000, 1000, 0, 0.01)
    expect(result).toBeNull()
  })

  it("usa divisão simples quando taxa é 0", () => {
    const result = calcularAporteNecessario(50000, 1000, 60, 0)
    expect(result).toBeCloseTo(816.67, 1)
  })

  it("retorna null se fator de crescimento é infinito", () => {
    const result = calcularAporteNecessario(1e308, 0, 1e6, 0.1)
    expect(result).toBeNull()
  })

  it("retorna null se pmt calculado for negativo (valor inicial já ultrapassa meta com juros)", () => {
    const result = calcularAporteNecessario(10000, 5000, 120, 0.01)
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run lib/calculations.test.ts
```

Expected: 1 test file, all tests pass (~15 tests total).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add calcularAporteNecessario function and Resultado.aporteNecessario"
```
