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
    <main className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F1EA' }}>
      <div className="max-w-[480px] mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-center" style={{ fontFamily: 'var(--font-fraunces)', color: '#2E2A24' }}>
          Calculadora de <em style={{ color: '#8A6340', fontStyle: 'italic' }}>Investimentos</em>
        </h1>

        <InvestmentForm onSimular={handleSimular} />

        {resultado && (
          <>
            <ResultsCards resultado={resultado} />

            <div className="border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', borderRadius: '9px' }}>
              <h2 className="text-xs uppercase tracking-wide mb-3" style={{ color: '#6E6558', fontWeight: 600, letterSpacing: '0.13em' }}>
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
