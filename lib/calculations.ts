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

export function calcularIR(lucro: number, dias: number, aliquotaFixa: number | null): { aliquota: number; valorIR: number } {
  if (lucro <= 0) return { aliquota: 0, valorIR: 0 }
  let aliquota: number
  if (aliquotaFixa !== null) {
    aliquota = aliquotaFixa
  } else if (dias < 180) {
    aliquota = 22.5
  } else if (dias < 360) {
    aliquota = 20
  } else if (dias < 720) {
    aliquota = 17.5
  } else {
    aliquota = 15
  }
  return { aliquota, valorIR: Math.round(lucro * aliquota) / 100 }
}

export function calcularInflacao(
  valores: { mes: number; valor: number }[],
  taxaMensalInflacao: number
): { mes: number; valor: number; valorCorrigido: number }[] {
  return valores.map((item) => {
    const fatorCorrecao = Math.pow(1 + taxaMensalInflacao, item.mes)
    return { ...item, valorCorrigido: Math.round((item.valor / fatorCorrecao) * 100) / 100 }
  })
}

export function rentabilidadeReal(taxaNominal: number, taxaInflacao: number): number {
  return (1 + taxaNominal) / (1 + taxaInflacao) - 1
}

export function calcularMeta(
  valorDesejado: number,
  valorInicial: number,
  aporteMensal: number,
  taxaMensal: number
): { meses: number; viavel: boolean } {
  if (valorInicial + aporteMensal * 1200 < valorDesejado) {
    return { meses: 0, viavel: false }
  }
  if (taxaMensal === 0) {
    if (aporteMensal <= 0) return { meses: 0, viavel: false }
    const meses = Math.ceil((valorDesejado - valorInicial) / aporteMensal)
    return { meses: Math.max(0, meses), viavel: true }
  }
  const pmtR = aporteMensal / taxaMensal
  const fator = (valorDesejado + pmtR) / (valorInicial + pmtR)
  if (fator <= 1) return { meses: 0, viavel: true }
  const n = Math.log(fator) / Math.log(1 + taxaMensal)
  if (!isFinite(n) || n < 0) return { meses: 0, viavel: false }
  return { meses: Math.ceil(n), viavel: true }
}

export function calcular(params: InputParams): Resultado {
  const { valorInicial, aporteMensal, taxa, taxaTipo, periodo, periodoTipo, aliquotaIR, modoIR, comeCotas, taxaInflacao, modoMeta, valorMeta } = params

  const taxaDecimal = taxa / 100
  const taxaMensal = taxaTipo === "ano" ? Math.pow(1 + taxaDecimal, 1 / 12) - 1 : taxaDecimal
  const nMeses = periodoTipo === "anos" ? periodo * 12 : periodo

  const evolucao: EvolucaoMes[] = []
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
        const result = calcularIR(lucroAcumulado, mes * 30, aliquotaIR ?? null)
        ir = result.valorIR
        valorLiquido = valor - ir
      } else if (mes === nMeses && lucroAcumulado > 0) {
        const result = calcularIR(lucroAcumulado, mes * 30, aliquotaIR ?? null)
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
