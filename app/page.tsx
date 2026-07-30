"use client"

import { useState, useCallback, useRef } from "react"
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

export default function Home() {
  const nextId = useRef(2)
  const [cenarios, setCenarios] = useState<CenarioState[]>([
    { id: "1", nome: "Cenário 1", resultado: null },
  ])
  const [ativo, setAtivo] = useState("1")

  const handleSimular = useCallback((params: InputParams) => {
    const res = calcular(params)
    setCenarios((prev) => prev.map((c) => (c.id === ativo ? { ...c, resultado: res } : c)))
  }, [ativo])

  const handleAdd = useCallback(() => {
    const id = String(nextId.current++)
    setCenarios((prev) => [...prev, { id, nome: `Cenário ${id}`, resultado: null }])
    setAtivo(id)
  }, [])

  const handleRemove = useCallback((id: string) => {
    setCenarios((prev) => {
      const novaLista = prev.filter((c) => c.id !== id)
      if (id === ativo && novaLista.length > 0) {
        setAtivo(novaLista[novaLista.length - 1].id)
      } else if (novaLista.length === 0) {
        const newId = String(nextId.current++)
        setCenarios([{ id: newId, nome: `Cenário ${newId}`, resultado: null }])
        setAtivo(newId)
        return [{ id: newId, nome: `Cenário ${newId}`, resultado: null }]
      }
      return novaLista
    })
  }, [ativo])

  const cenarioAtivo = cenarios.find((c) => c.id === ativo)

  return (
    <main className="min-h-screen py-8 px-4 relative" style={{ backgroundColor: '#F5F1EA' }}>
      <div
        className="fixed bottom-0 left-0 z-0 pointer-events-none select-none opacity-40 w-40 h-auto -translate-x-1/4 translate-y-1/4 md:w-[285px] md:h-[393px] md:-translate-x-1/4 md:translate-y-1/4"
        style={{
          WebkitMaskImage: 'linear-gradient(to top right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
          maskImage: 'linear-gradient(to top right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)'
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 285.0 393.7" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><polygon points="60.0,30.0 45.0,56.0 15.0,56.0 0.0,30.0 15.0,4.0 45.0,4.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,82.0 45.0,107.9 15.0,107.9 0.0,82.0 15.0,56.0 45.0,56.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,133.9 45.0,159.9 15.0,159.9 0.0,133.9 15.0,107.9 45.0,107.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,185.9 45.0,211.9 15.0,211.9 0.0,185.9 15.0,159.9 45.0,159.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,237.8 45.0,263.8 15.0,263.8 0.0,237.8 15.0,211.9 45.0,211.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,289.8 45.0,315.8 15.0,315.8 0.0,289.8 15.0,263.8 45.0,263.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,341.8 45.0,367.7 15.0,367.7 0.0,341.8 15.0,315.8 45.0,315.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,56.0 90.0,82.0 60.0,82.0 45.0,56.0 60.0,30.0 90.0,30.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,107.9 90.0,133.9 60.0,133.9 45.0,107.9 60.0,82.0 90.0,82.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,159.9 90.0,185.9 60.0,185.9 45.0,159.9 60.0,133.9 90.0,133.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,211.9 90.0,237.8 60.0,237.8 45.0,211.9 60.0,185.9 90.0,185.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,263.8 90.0,289.8 60.0,289.8 45.0,263.8 60.0,237.8 90.0,237.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,315.8 90.0,341.8 60.0,341.8 45.0,315.8 60.0,289.8 90.0,289.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,367.7 90.0,393.7 60.0,393.7 45.0,367.7 60.0,341.8 90.0,341.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,30.0 135.0,56.0 105.0,56.0 90.0,30.0 105.0,4.0 135.0,4.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,82.0 135.0,107.9 105.0,107.9 90.0,82.0 105.0,56.0 135.0,56.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,133.9 135.0,159.9 105.0,159.9 90.0,133.9 105.0,107.9 135.0,107.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,185.9 135.0,211.9 105.0,211.9 90.0,185.9 105.0,159.9 135.0,159.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,237.8 135.0,263.8 105.0,263.8 90.0,237.8 105.0,211.9 135.0,211.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,289.8 135.0,315.8 105.0,315.8 90.0,289.8 105.0,263.8 135.0,263.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,341.8 135.0,367.7 105.0,367.7 90.0,341.8 105.0,315.8 135.0,315.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,56.0 180.0,82.0 150.0,82.0 135.0,56.0 150.0,30.0 180.0,30.0" fill="#E8D5B7" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,107.9 180.0,133.9 150.0,133.9 135.0,107.9 150.0,82.0 180.0,82.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,159.9 180.0,185.9 150.0,185.9 135.0,159.9 150.0,133.9 180.0,133.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,211.9 180.0,237.8 150.0,237.8 135.0,211.9 150.0,185.9 180.0,185.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,263.8 180.0,289.8 150.0,289.8 135.0,263.8 150.0,237.8 180.0,237.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,315.8 180.0,341.8 150.0,341.8 135.0,315.8 150.0,289.8 180.0,289.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,367.7 180.0,393.7 150.0,393.7 135.0,367.7 150.0,341.8 180.0,341.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,30.0 225.0,56.0 195.0,56.0 180.0,30.0 195.0,4.0 225.0,4.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,82.0 225.0,107.9 195.0,107.9 180.0,82.0 195.0,56.0 225.0,56.0" fill="#E8D5B7" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,133.9 225.0,159.9 195.0,159.9 180.0,133.9 195.0,107.9 225.0,107.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,185.9 225.0,211.9 195.0,211.9 180.0,185.9 195.0,159.9 225.0,159.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,237.8 225.0,263.8 195.0,263.8 180.0,237.8 195.0,211.9 225.0,211.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,289.8 225.0,315.8 195.0,315.8 180.0,289.8 195.0,263.8 225.0,263.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,341.8 225.0,367.7 195.0,367.7 180.0,341.8 195.0,315.8 225.0,315.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,56.0 270.0,82.0 240.0,82.0 225.0,56.0 240.0,30.0 270.0,30.0" fill="#E8D5B7" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,107.9 270.0,133.9 240.0,133.9 225.0,107.9 240.0,82.0 270.0,82.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,159.9 270.0,185.9 240.0,185.9 225.0,159.9 240.0,133.9 270.0,133.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,211.9 270.0,237.8 240.0,237.8 225.0,211.9 240.0,185.9 270.0,185.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,263.8 270.0,289.8 240.0,289.8 225.0,263.8 240.0,237.8 270.0,237.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,315.8 270.0,341.8 240.0,341.8 225.0,315.8 240.0,289.8 270.0,289.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,367.7 270.0,393.7 240.0,393.7 225.0,367.7 240.0,341.8 270.0,341.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon></svg>
      </div>
      <div
        className="fixed top-0 right-0 z-0 pointer-events-none select-none opacity-40 rotate-180 w-40 h-auto translate-x-1/4 -translate-y-1/4 md:w-[285px] md:h-[393px] md:translate-x-1/4 md:-translate-y-1/4"
        style={{
          WebkitMaskImage: 'linear-gradient(to top right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
          maskImage: 'linear-gradient(to top right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)'
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 285.0 393.7" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><polygon points="60.0,30.0 45.0,56.0 15.0,56.0 0.0,30.0 15.0,4.0 45.0,4.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,82.0 45.0,107.9 15.0,107.9 0.0,82.0 15.0,56.0 45.0,56.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,133.9 45.0,159.9 15.0,159.9 0.0,133.9 15.0,107.9 45.0,107.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,185.9 45.0,211.9 15.0,211.9 0.0,185.9 15.0,159.9 45.0,159.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,237.8 45.0,263.8 15.0,263.8 0.0,237.8 15.0,211.9 45.0,211.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,289.8 45.0,315.8 15.0,315.8 0.0,289.8 15.0,263.8 45.0,263.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="60.0,341.8 45.0,367.7 15.0,367.7 0.0,341.8 15.0,315.8 45.0,315.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,56.0 90.0,82.0 60.0,82.0 45.0,56.0 60.0,30.0 90.0,30.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,107.9 90.0,133.9 60.0,133.9 45.0,107.9 60.0,82.0 90.0,82.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,159.9 90.0,185.9 60.0,185.9 45.0,159.9 60.0,133.9 90.0,133.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,211.9 90.0,237.8 60.0,237.8 45.0,211.9 60.0,185.9 90.0,185.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,263.8 90.0,289.8 60.0,289.8 45.0,263.8 60.0,237.8 90.0,237.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,315.8 90.0,341.8 60.0,341.8 45.0,315.8 60.0,289.8 90.0,289.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="105.0,367.7 90.0,393.7 60.0,393.7 45.0,367.7 60.0,341.8 90.0,341.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,30.0 135.0,56.0 105.0,56.0 90.0,30.0 105.0,4.0 135.0,4.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,82.0 135.0,107.9 105.0,107.9 90.0,82.0 105.0,56.0 135.0,56.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,133.9 135.0,159.9 105.0,159.9 90.0,133.9 105.0,107.9 135.0,107.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,185.9 135.0,211.9 105.0,211.9 90.0,185.9 105.0,159.9 135.0,159.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,237.8 135.0,263.8 105.0,263.8 90.0,237.8 105.0,211.9 135.0,211.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,289.8 135.0,315.8 105.0,315.8 90.0,289.8 105.0,263.8 135.0,263.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="150.0,341.8 135.0,367.7 105.0,367.7 90.0,341.8 105.0,315.8 135.0,315.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,56.0 180.0,82.0 150.0,82.0 135.0,56.0 150.0,30.0 180.0,30.0" fill="#E8D5B7" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,107.9 180.0,133.9 150.0,133.9 135.0,107.9 150.0,82.0 180.0,82.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,159.9 180.0,185.9 150.0,185.9 135.0,159.9 150.0,133.9 180.0,133.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,211.9 180.0,237.8 150.0,237.8 135.0,211.9 150.0,185.9 180.0,185.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,263.8 180.0,289.8 150.0,289.8 135.0,263.8 150.0,237.8 180.0,237.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,315.8 180.0,341.8 150.0,341.8 135.0,315.8 150.0,289.8 180.0,289.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="195.0,367.7 180.0,393.7 150.0,393.7 135.0,367.7 150.0,341.8 180.0,341.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,30.0 225.0,56.0 195.0,56.0 180.0,30.0 195.0,4.0 225.0,4.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,82.0 225.0,107.9 195.0,107.9 180.0,82.0 195.0,56.0 225.0,56.0" fill="#E8D5B7" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,133.9 225.0,159.9 195.0,159.9 180.0,133.9 195.0,107.9 225.0,107.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,185.9 225.0,211.9 195.0,211.9 180.0,185.9 195.0,159.9 225.0,159.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,237.8 225.0,263.8 195.0,263.8 180.0,237.8 195.0,211.9 225.0,211.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,289.8 225.0,315.8 195.0,315.8 180.0,289.8 195.0,263.8 225.0,263.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="240.0,341.8 225.0,367.7 195.0,367.7 180.0,341.8 195.0,315.8 225.0,315.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,56.0 270.0,82.0 240.0,82.0 225.0,56.0 240.0,30.0 270.0,30.0" fill="#E8D5B7" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,107.9 270.0,133.9 240.0,133.9 225.0,107.9 240.0,82.0 270.0,82.0" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,159.9 270.0,185.9 240.0,185.9 225.0,159.9 240.0,133.9 270.0,133.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,211.9 270.0,237.8 240.0,237.8 225.0,211.9 240.0,185.9 270.0,185.9" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,263.8 270.0,289.8 240.0,289.8 225.0,263.8 240.0,237.8 270.0,237.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,315.8 270.0,341.8 240.0,341.8 225.0,315.8 240.0,289.8 270.0,289.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon><polygon points="285.0,367.7 270.0,393.7 240.0,393.7 225.0,367.7 240.0,341.8 270.0,341.8" fill="none" stroke="#C4956A" strokeWidth={1.5}></polygon></svg>
      </div>
      <div className="max-w-[480px] lg:max-w-[640px] mx-auto space-y-6">
        <div className="flex flex-col items-center relative z-10">
          <div className="overflow-hidden mb-1" style={{ width: 180, height: 90 }}>
            <img src="/logo_camila.png" alt="Logo" className="w-full h-full" style={{ objectFit: 'cover', transform: 'scale(1.5)', transformOrigin: 'center' }} />
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-center tracking-tight -mt-2" style={{ fontFamily: 'var(--font-fraunces)', color: '#2E2A24' }}>
            Calculadora de <em style={{ color: '#8A6340', fontStyle: 'italic' }}>Investimentos</em>
          </h1>
          <p className="text-xs lg:text-sm text-center mt-1" style={{ color: '#9A9083', letterSpacing: '0.05em' }}>
            Projete seu futuro financeiro
          </p>
        </div>

        <ScenarioTabs
          tabs={cenarios.map(({ id, nome }) => ({ id, nome }))}
          ativo={ativo}
          onSelect={setAtivo}
          onAdd={handleAdd}
          onRemove={handleRemove}
        >
          {() => (
              <div className="space-y-7">
              <InvestmentForm onSimular={handleSimular} resultado={cenarioAtivo?.resultado} />
              {cenarioAtivo?.resultado ? (
                <div className="animate-fade-up space-y-7">
                  <ResultsCards resultado={cenarioAtivo.resultado} />
                  <div className="border p-5 card-hover" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', borderRadius: '9px' }}>
                    <h2 className="text-xs sm:text-sm uppercase tracking-wide mb-4" style={{ color: '#6E6558', fontWeight: 600, letterSpacing: '0.13em' }}>
                      Evolução do Patrimônio
                    </h2>
                    <EvolutionChart data={cenarioAtivo.resultado.evolucao} inflacaoAtiva={!!cenarioAtivo.resultado.totalCorrigido} />
                  </div>
                  <CompositionChart
                    totalInvestido={cenarioAtivo.resultado.totalInvestido}
                    jurosGanhos={cenarioAtivo.resultado.jurosGanhos}
                  />
                  <DetailTable evolucao={cenarioAtivo.resultado.evolucao} inflacaoAtiva={!!cenarioAtivo.resultado.totalCorrigido} />
                </div>
              ) : (
                <div className="text-center py-12 animate-fade-up" style={{ color: '#9A9083' }}>
                  <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', color: '#6E6558' }}>
                    Preencha os parâmetros e simule seu investimento
                  </p>
                  <p className="text-xs mt-1">
                    Ajuste valor inicial, aporte, taxa e período para ver a projeção
                  </p>
                </div>
              )}
            </div>
          )}
        </ScenarioTabs>
      </div>
    </main>
  )
}
