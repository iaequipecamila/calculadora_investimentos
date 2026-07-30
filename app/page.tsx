"use client"

import { useState } from "react"
import { InvestmentForm } from "@/components/investment-form"
import { ResultsCards } from "@/components/results-cards"
import { EvolutionChart } from "@/components/evolution-chart"
import { calcular } from "@/lib/calculations"
import type { InputParams, Resultado } from "@/lib/calculations"

export default function Home() {
  const [resultado, setResultado] = useState<Resultado | null>(null)

  function handleSimular(params: InputParams) {
    const res = calcular(params)
    setResultado(res)
  }

  return (
    <main className="min-h-screen bg-stone-100 py-8 px-4">
      <div className="max-w-[480px] mx-auto space-y-6">
        <h1 className="text-xl font-bold text-stone-900 text-center">
          💰 Calculadora de Investimentos
        </h1>

        <InvestmentForm onSimular={handleSimular} />

        {resultado && (
          <>
            <ResultsCards resultado={resultado} />

            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <h2 className="text-sm text-stone-500 uppercase tracking-wide mb-3">
                Evolução do Patrimônio
              </h2>
              <EvolutionChart data={resultado.evolucao} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
