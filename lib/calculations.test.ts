import { calcular, calcularIR, calcularInflacao, rentabilidadeReal, calcularMeta, calcularAporteNecessario } from "./calculations"

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

  it("retorna viavel=false se não há aporte nem juros", () => {
    const result = calcularMeta(1_000_000, 0, 0, 0)
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

  it("inclui aporteNecessario no resultado quando modoMeta está ativo", () => {
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
    expect(result.aporteNecessario).toBeDefined()
    expect(result.aporteNecessario).toBeGreaterThan(0)
  })
})

describe("calcularAporteNecessario", () => {
  it("calcula aporte necessário para atingir meta em n meses", () => {
    const result = calcularAporteNecessario(50000, 1000, 60, 0.01)
    expect(result).toBeCloseTo(589.98, 0)
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
    expect(result).toBeCloseTo(816.67, 0)
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

describe("come-cotas", () => {
  it("cobra IR de 15% a cada 6 meses sobre o ganho do semestre", () => {
    const result = calcular({
      valorInicial: 10000,
      aporteMensal: 0,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 12,
      periodoTipo: "meses",
      modoIR: "tabela",
      comeCotas: true,
    })
    // Sem aportes, 12 meses a 12% a.a.
    // Mês 6: valor = 10000 * (1+taxaMensal)^6, lucroSemestre = valor - 10000, IR 15% desse lucro
    // Mês 12: valor = 10000 * (1+taxaMensal)^12, lucroRestante = lucroTotal - lucroJaTributado, IR pela tabela
    expect(result.totalIR).toBeGreaterThan(0)
    expect(result.totalLiquido).toBe(result.totalBruto - result.totalIR)
    // Verifica que houve IR nos meses 6 e 12
    expect(result.evolucao[6].ir).toBeGreaterThan(0)
    expect(result.evolucao[12].ir).toBeGreaterThan(0)
    // Mês 1 não deve ter IR
    expect(result.evolucao[1].ir).toBe(0)
  })

  it("usa alíquota fixa de 15% no come-cotas independente do modoIR", () => {
    const result = calcular({
      valorInicial: 50000,
      aporteMensal: 0,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 12,
      periodoTipo: "meses",
      modoIR: "tabela",
      comeCotas: true,
    })
    // Mês 6 (come-cotas, não é o final): ganho = valor - baseComeCotas, IR = 15% do ganho
    const valorMes6 = result.evolucao[6].valor
    const ganhoSemestre = valorMes6 - 50000
    expect(result.evolucao[6].ir).toBeGreaterThan(0)
    expect(result.evolucao[6].ir).toBeCloseTo(Math.round(ganhoSemestre * 15) / 100, 1)
  })

  it("não cobra come-cotas no mês final se coincidir com semestre (IR final cobre)", () => {
    const result = calcular({
      valorInicial: 10000,
      aporteMensal: 1000,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 6,
      periodoTipo: "meses",
      modoIR: "tabela",
      comeCotas: true,
    })
    // Mês 6 é final — não deve ter come-cotas duplicado
    // Apenas o IR final deve aparecer
    expect(result.evolucao[6].ir).toBeGreaterThan(0)
  })
})

describe("calcular — borda", () => {
  it("funciona com todos os valores zerados", () => {
    const result = calcular({
      valorInicial: 0,
      aporteMensal: 0,
      taxa: 0,
      taxaTipo: "mes",
      periodo: 12,
      periodoTipo: "meses",
    })
    expect(result.totalBruto).toBe(0)
    expect(result.totalInvestido).toBe(0)
    expect(result.jurosGanhos).toBe(0)
  })

  it("funciona com taxa zero", () => {
    const result = calcular({
      valorInicial: 1000,
      aporteMensal: 500,
      taxa: 0,
      taxaTipo: "mes",
      periodo: 6,
      periodoTipo: "meses",
    })
    // Sem juros: total = 1000 + 500*6 = 4000
    expect(result.totalBruto).toBe(4000)
    expect(result.jurosGanhos).toBe(0)
  })

  it("funciona com período em anos", () => {
    const result = calcular({
      valorInicial: 1000,
      aporteMensal: 500,
      taxa: 12,
      taxaTipo: "ano",
      periodo: 1,
      periodoTipo: "anos",
      modoIR: "fixo",
      aliquotaIR: 15,
    })
    // 1 ano = 12 meses
    expect(result.evolucao.length).toBe(13) // 0..12
    expect(result.totalBruto).toBeGreaterThan(0)
    expect(result.totalLiquido).toBe(result.totalBruto - result.totalIR)
  })
})
