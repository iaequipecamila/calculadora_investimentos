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
})

describe("calcularAporteNecessario", () => {
  it("calcula aporte necessário para atingir meta em n meses", () => {
    const result = calcularAporteNecessario(50000, 1000, 60, 0.01)
    expect(result).toBeCloseTo(589.98, 1)
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
