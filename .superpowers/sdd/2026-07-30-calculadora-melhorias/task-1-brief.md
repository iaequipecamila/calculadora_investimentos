### Task 1: Core de Cálculos

**Files:**
- Modify: `lib/calculations.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `InputParams`, `Resultado`, `EvolucaoMes`, `calcular()`, `calcularIR()`, `calcularInflacao()`, `rentabilidadeReal()`, `calcularMeta()`

- [ ] **Step 1: Write failing tests for new calculation functions**

Create `lib/calculations.test.ts`:

```ts
import { calcular, calcularIR, calcularInflacao, rentabilidadeReal, calcularMeta } from "./calculations"

describe("calcularIR", () => {
  it("aplica aliquota fixa de 15% sobre o lucro", () => {
    const result = calcularIR(100000, 720, 15)
    expect(result.valorIR).toBe(15000)
    expect(result.aliquota).toBe(15)
  })

  it("usa tabela regressiva quando aliquotaFixa é null", () => {
    // 100 dias → 22,5%
    const result = calcularIR(10000, 100, null)
    expect(result.aliquota).toBe(22.5)
    expect(result.valorIR).toBe(2250)
  })

  it("usa 15% para 730 dias", () => {
    const result = calcularIR(10000, 730, null)
    expect(result.aliquota).toBe(15)
    expect(result.valorIR).toBe(1500)
  })

  it("retorna 0 quando lucro é 0", () => {
    const result = calcularIR(0, 100, 15)
    expect(result.valorIR).toBe(0)
  })
})

describe("calcularInflacao", () => {
  it("corrige array de valores pela inflação mensal", () => {
    // inflação 1% ao mês
    const valores = [
      { mes: 0, valor: 1000 },
      { mes: 1, valor: 1100 },
    ]
    const result = calcularInflacao(valores, 0.01)
    expect(result[0].valorCorrigido).toBeCloseTo(1000)
    expect(result[1].valorCorrigido).toBeCloseTo(1089.11, 1)
  })
})

describe("rentabilidadeReal", () => {
  it("calcula taxa real com inflação usando fórmula de Fisher", () => {
    const result = rentabilidadeReal(0.12, 0.06)
    expect(result).toBeCloseTo(0.0566, 3)
  })
})

describe("calcularMeta", () => {
  it("retorna meses necessários para atingir a meta", () => {
    const result = calcularMeta(50000, 1000, 500, 0.01)
    expect(result.meses).toBeGreaterThan(0)
    expect(result.viavel).toBe(true)
  })

  it("retorna viavel=false se aporte é insuficiente mesmo sem prazo", () => {
    const result = calcularMeta(1_000_000, 0, 100, 0.01)
    expect(result.viavel).toBe(false)
  })
})

describe("calcular (estendido)", () => {
  it("calcula IR quando aliquota é fornecida", () => {
    const result = calcular({
      valorInicial: 10000,
      aporteMensal: 1000,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 12,
      periodoTipo: "meses",
      modoIR: "fixo",
      aliquotaIR: 15,
    })
    expect(result.totalIR).toBeGreaterThan(0)
    expect(result.totalLiquido).toBe(result.totalBruto - result.totalIR)
  })

  it("calcula inflação quando taxa é fornecida", () => {
    const result = calcular({
      valorInicial: 10000,
      aporteMensal: 1000,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 12,
      periodoTipo: "meses",
      taxaInflacao: 6,
    })
    expect(result.totalCorrigido).toBeLessThan(result.totalBruto)
  })

  it("calcula meta quando modoMeta é true", () => {
    const result = calcular({
      valorInicial: 1000,
      aporteMensal: 500,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 60,
      periodoTipo: "meses",
      modoMeta: true,
      valorMeta: 50000,
    })
    expect(result.mesesParaMeta).toBeDefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/calculations.test.ts 2>&1 || true
```

Expected: failures because functions aren't defined yet

- [ ] **Step 3: Write interfaces and implement functions**

Replace `lib/calculations.ts` content:

```ts
export interface InputParams {
  valorInicial: number
  aporteMensal: number
  taxa: number
  taxaTipo: "ano" | "mes"
  periodo: number
  periodoTipo: "anos" | "meses"
  aliquotaIR?: number
  modoIR?: "fixo" | "tabela"
  comeCotas?: boolean
  taxaInflacao?: number
  modoMeta?: boolean
  valorMeta?: number
}

export interface EvolucaoMes {
  mes: number
  valor: number
  aporte: number
  ir?: number
  valorLiquido?: number
  valorCorrigido?: number
}

export interface Resultado {
  totalBruto: number
  totalInvestido: number
  jurosGanhos: number
  evolucao: EvolucaoMes[]
  totalLiquido: number
  totalIR: number
  aliquotaIREfetiva: number
  totalCorrigido: number
  mesesParaMeta?: number
}

function calcularIR(lucro: number, meses: number, aliquotaFixa: number | null): { aliquota: number; valorIR: number } {
  if (lucro <= 0) return { aliquota: 0, valorIR: 0 }
  let aliquota: number
  if (aliquotaFixa !== null) {
    aliquota = aliquotaFixa
  } else if (meses < 6) {
    aliquota = 22.5
  } else if (meses < 12) {
    aliquota = 20
  } else if (meses < 24) {
    aliquota = 17.5
  } else {
    aliquota = 15
  }
  return { aliquota, valorIR: Math.round(lucro * aliquota) / 100 }
}

function calcularInflacao(
  valores: { mes: number; valor: number }[],
  taxaMensalInflacao: number
): { mes: number; valor: number; valorCorrigido: number }[] {
  return valores.map((item) => {
    const fatorCorrecao = Math.pow(1 + taxaMensalInflacao, item.mes)
    return { ...item, valorCorrigido: Math.round((item.valor / fatorCorrecao) * 100) / 100 }
  })
}

function rentabilidadeReal(taxaNominal: number, taxaInflacao: number): number {
  return (1 + taxaNominal) / (1 + taxaInflacao) - 1
}

function calcularMeta(
  valorDesejado: number,
  valorInicial: number,
  aporteMensal: number,
  taxaMensal: number
): { meses: number; viavel: boolean } {
  if (taxaMensal === 0) {
    if (aporteMensal <= 0) return { meses: 0, viavel: false }
    const meses = Math.ceil((valorDesejado - valorInicial) / aporteMensal)
    return { meses: Math.max(0, meses), viavel: true }
  }
  const alvo = valorDesejado - valorInicial * Math.pow(1 + taxaMensal, 1200)
  if (alvo <= 0) return { meses: 0, viavel: true }
  const pmt = aporteMensal * ((Math.pow(1 + taxaMensal, 1200) - 1) / taxaMensal)
  if (pmt <= 0) return { meses: 0, viavel: false }
  const n = Math.log(1 + (alvo * taxaMensal) / aporteMensal) / Math.log(1 + taxaMensal)
  if (!isFinite(n)) return { meses: 0, viavel: false }
  return { meses: Math.ceil(n), viavel: true }
}

export function calcular(params: InputParams): Resultado {
  const { valorInicial, aporteMensal, taxa, taxaTipo, periodo, periodoTipo, aliquotaIR, modoIR, comeCotas, taxaInflacao, modoMeta, valorMeta } = params

  const taxaDecimal = taxa / 100
  const taxaMensal = taxaTipo === "ano" ? Math.pow(1 + taxaDecimal, 1 / 12) - 1 : taxaDecimal
  const nMeses = periodoTipo === "anos" ? periodo * 12 : periodo

  const evolucao: EvolucaoMes[] = []
  let ultimoValor = valorInicial

  for (let mes = 0; mes <= nMeses; mes++) {
    let valor: number
    if (taxaMensal === 0) {
      valor = valorInicial + aporteMensal * mes
    } else {
      valor =
        valorInicial * Math.pow(1 + taxaMensal, mes) +
        aporteMensal * ((Math.pow(1 + taxaMensal, mes) - 1) / taxaMensal)
    }

    const aporte = mes === 0 ? 0 : aporteMensal

    let ir = 0
    let valorLiquido: number | undefined

    if (aliquotaIR !== undefined || modoIR === "tabela" || modoIR === "fixo") {
      const lucroAcumulado = valor - (valorInicial + aporteMensal * mes)
      if (comeCotas && mes > 0 && mes % 6 === 0 && lucroAcumulado > 0) {
        const result = calcularIR(lucroAcumulado, mes, aliquotaIR ?? null)
        ir = result.valorIR
        valorLiquido = valor - ir
      } else if (mes === nMeses && lucroAcumulado > 0) {
        const result = calcularIR(lucroAcumulado, mes, aliquotaIR ?? null)
        ir = result.valorIR
        valorLiquido = valor - ir
      }
    }

    evolucao.push({ mes, valor: Math.round(valor * 100) / 100, aporte, ir, valorLiquido })
  }

  const totalBruto = evolucao[nMeses].valor
  const totalInvestido = Math.round((valorInicial + aporteMensal * nMeses) * 100) / 100
  const jurosGanhos = Math.round((totalBruto - totalInvestido) * 100) / 100

  let totalIR = 0
  for (const e of evolucao) {
    totalIR += e.ir ?? 0
  }
  totalIR = Math.round(totalIR * 100) / 100
  const totalLiquido = Math.round((totalBruto - totalIR) * 100) / 100

  const aliquotaIREfetiva = totalIR > 0 && jurosGanhos > 0 ? Math.round((totalIR / jurosGanhos) * 10000) / 100 : 0

  let totalCorrigido = totalBruto
  if (taxaInflacao) {
    const inflacaoMensal = Math.pow(1 + taxaInflacao / 100, 1 / 12) - 1
    const corrigidos = calcularInflacao(evolucao.map((e) => ({ mes: e.mes, valor: e.valor })), inflacaoMensal)
    for (let i = 0; i < evolucao.length; i++) {
      evolucao[i].valorCorrigido = corrigidos[i].valorCorrigido
    }
    totalCorrigido = Math.round((totalBruto / Math.pow(1 + inflacaoMensal, nMeses)) * 100) / 100
  }

  let mesesParaMeta: number | undefined
  if (modoMeta && valorMeta) {
    mesesParaMeta = calcularMeta(valorMeta, valorInicial, aporteMensal, taxaMensal).meses
  }

  return {
    totalBruto,
    totalInvestido,
    jurosGanhos,
    evolucao,
    totalLiquido,
    totalIR,
    aliquotaIREfetiva,
    totalCorrigido,
    mesesParaMeta,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/calculations.test.ts
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/calculations.ts lib/calculations.test.ts
git commit -m "feat: add IR, inflation, goal, and CDI calculations"
```

---
