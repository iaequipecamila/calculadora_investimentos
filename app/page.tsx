"use client"

import { useState, useCallback, useEffect } from "react"
import { InvestmentForm } from "@/components/investment-form"
import { ResultsCards } from "@/components/results-cards"
import { EvolutionChart } from "@/components/evolution-chart"
import { ScenarioTabs } from "@/components/scenario-tabs"
import { DetailTable } from "@/components/detail-table"
import { CompositionChart } from "@/components/composition-chart"
import { calcular } from "@/lib/calculations"
import type { InputParams, Resultado } from "@/lib/calculations"

interface CenarioState {
  id: string
  nome: string
  resultado: Resultado | null
}

let nextId = 2

export default function Home() {
  const [cenarios, setCenarios] = useState<CenarioState[]>([
    { id: "1", nome: "Cenário 1", resultado: null },
  ])
  const [ativo, setAtivo] = useState("1")

  const handleSimular = useCallback((params: InputParams) => {
    const res = calcular(params)
    setCenarios((prev) => prev.map((c) => (c.id === ativo ? { ...c, resultado: res } : c)))
  }, [ativo])

  const handleAdd = useCallback(() => {
    const id = String(nextId++)
    setCenarios((prev) => [...prev, { id, nome: `Cenário ${id}`, resultado: null }])
    setAtivo(id)
  }, [])

  const handleRemove = useCallback((id: string) => {
    setCenarios((prev) => prev.filter((c) => c.id !== id))
  }, [])

  useEffect(() => {
    setAtivo((prev) => {
      if (!cenarios.some((c) => c.id === prev)) {
        return cenarios.length > 0 ? cenarios[cenarios.length - 1].id : "1"
      }
      return prev
    })
  }, [cenarios])

  const cenarioAtivo = cenarios.find((c) => c.id === ativo)

  return (
    <main className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F1EA' }}>
      <div className="max-w-[480px] mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-center" style={{ fontFamily: 'var(--font-fraunces)', color: '#2E2A24' }}>
          Calculadora de <em style={{ color: '#8A6340', fontStyle: 'italic' }}>Investimentos</em>
        </h1>

        <ScenarioTabs
          tabs={cenarios.map(({ id, nome }) => ({ id, nome }))}
          ativo={ativo}
          onSelect={setAtivo}
          onAdd={handleAdd}
          onRemove={handleRemove}
        >
          {() => (
            <div className="space-y-5">
              <InvestmentForm onSimular={handleSimular} resultado={cenarioAtivo?.resultado} />
              {cenarioAtivo?.resultado && (
                <>
                  <ResultsCards resultado={cenarioAtivo.resultado} />
                  <div className="border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', borderRadius: '9px' }}>
                    <h2 className="text-xs uppercase tracking-wide mb-3" style={{ color: '#6E6558', fontWeight: 600, letterSpacing: '0.13em' }}>
                      Evolução do Patrimônio
                    </h2>
                    <EvolutionChart data={cenarioAtivo.resultado.evolucao} inflacaoAtiva={!!cenarioAtivo.resultado.totalCorrigido} />
                  </div>
                  <CompositionChart
                    totalInvestido={cenarioAtivo.resultado.totalInvestido}
                    jurosGanhos={cenarioAtivo.resultado.jurosGanhos}
                  />
                  <DetailTable evolucao={cenarioAtivo.resultado.evolucao} inflacaoAtiva={!!cenarioAtivo.resultado.totalCorrigido} />
                </>
              )}
            </div>
          )}
        </ScenarioTabs>
      </div>
    </main>
  )
}
