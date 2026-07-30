export interface InputParams {
  valorInicial: number
  aporteMensal: number
  taxa: number
  taxaTipo: "ano" | "mes"
  periodo: number
  periodoTipo: "anos" | "meses"
}

export interface Resultado {
  totalBruto: number
  totalInvestido: number
  jurosGanhos: number
  evolucao: { mes: number; valor: number }[]
}

export function calcular(params: InputParams): Resultado {
  const { valorInicial, aporteMensal, taxa, taxaTipo, periodo, periodoTipo } = params

  const taxaMensal = taxaTipo === "ano" ? taxa / 100 / 12 : taxa / 100
  const nMeses = periodoTipo === "anos" ? periodo * 12 : periodo

  let totalBruto: number
  if (taxaMensal === 0) {
    totalBruto = valorInicial + aporteMensal * nMeses
  } else {
    totalBruto =
      valorInicial * Math.pow(1 + taxaMensal, nMeses) +
      aporteMensal * ((Math.pow(1 + taxaMensal, nMeses) - 1) / taxaMensal)
  }

  const totalInvestido = valorInicial + aporteMensal * nMeses
  const jurosGanhos = totalBruto - totalInvestido

  const evolucao: { mes: number; valor: number }[] = []
  for (let mes = 0; mes <= nMeses; mes++) {
    if (taxaMensal === 0) {
      evolucao.push({ mes, valor: valorInicial + aporteMensal * mes })
    } else {
      const valor =
        valorInicial * Math.pow(1 + taxaMensal, mes) +
        aporteMensal * ((Math.pow(1 + taxaMensal, mes) - 1) / taxaMensal)
      evolucao.push({ mes, valor })
    }
  }

  return {
    totalBruto: Math.round(totalBruto * 100) / 100,
    totalInvestido: Math.round(totalInvestido * 100) / 100,
    jurosGanhos: Math.round(jurosGanhos * 100) / 100,
    evolucao,
  }
}
