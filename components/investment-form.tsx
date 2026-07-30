"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { BasicSection } from "@/components/sections/basic-section"
import { IrSection } from "@/components/sections/ir-section"
import { InflationSection } from "@/components/sections/inflation-section"
import { GoalSection } from "@/components/sections/goal-section"
import { useCurrencyInput } from "@/hooks/use-currency-input"
import type { InputParams, Resultado } from "@/lib/calculations"

interface InvestmentFormProps {
  onSimular: (params: InputParams) => void
  resultado?: Resultado | null
}

export function InvestmentForm({ onSimular, resultado }: InvestmentFormProps) {
  const valorInicial = useCurrencyInput(0)
  const aporteMensal = useCurrencyInput(0)
  const valorMeta = useCurrencyInput(0)
  const [taxa, setTaxa] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [taxaTipo, setTaxaTipo] = useState<"ano" | "mes">("ano")
  const [modoIR, setModoIR] = useState<"fixo" | "tabela">("tabela")
  const [aliquotaIR, setAliquotaIR] = useState("")
  const [comeCotas, setComeCotas] = useState(false)
  const [inflacaoAtiva, setInflacaoAtiva] = useState(false)
  const [taxaInflacao, setTaxaInflacao] = useState("")
  const [metaAtiva, setMetaAtiva] = useState(false)

  const periodoTipo = taxaTipo === "ano" ? "anos" : "meses"

  const handleSimular = useCallback(() => {
    const params: InputParams = {
      valorInicial: valorInicial.rawValue,
      aporteMensal: aporteMensal.rawValue,
      taxa: parseFloat(taxa.replace(",", ".")) || 0,
      taxaTipo,
      periodo: parseInt(periodo, 10) || 0,
      periodoTipo,
      ...(modoIR === "tabela" ? { modoIR: "tabela" as const, ...(comeCotas ? { comeCotas: true } : {}) } : { modoIR: "fixo" as const, aliquotaIR: parseFloat(aliquotaIR.replace(",", ".")) || 0, ...(comeCotas ? { comeCotas: true } : {}) }),
      ...(inflacaoAtiva ? { taxaInflacao: parseFloat(taxaInflacao.replace(",", ".")) || 0 } : {}),
      ...(metaAtiva && valorMeta.rawValue > 0 ? { modoMeta: true as const, valorMeta: valorMeta.rawValue } : {}),
    }
    onSimular(params)
  }, [valorInicial.rawValue, aporteMensal.rawValue, taxa, taxaTipo, periodo, periodoTipo, modoIR, aliquotaIR, comeCotas, inflacaoAtiva, taxaInflacao, metaAtiva, valorMeta.rawValue, onSimular])

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <BasicSection
          valorInicial={valorInicial}
          aporteMensal={aporteMensal}
          taxa={taxa}
          onTaxaChange={setTaxa}
          taxaTipo={taxaTipo}
          onTaxaTipoChange={setTaxaTipo}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
        />
      </div>

      <IrSection
        aliquotaIR={aliquotaIR}
        onAliquotaIRChange={setAliquotaIR}
        modoIR={modoIR}
        onModoIRChange={setModoIR}
        comeCotas={comeCotas}
        onComeCotasChange={setComeCotas}
      />

      <InflationSection
        taxaInflacao={taxaInflacao}
        onTaxaInflacaoChange={setTaxaInflacao}
        ativo={inflacaoAtiva}
        onAtivoChange={setInflacaoAtiva}
      />

      <GoalSection
        valorMeta={valorMeta}
        onValorMetaChange={valorMeta.onChange}
        ativo={metaAtiva}
        onAtivoChange={setMetaAtiva}
        mesesParaMeta={resultado?.mesesParaMeta}
        metaViavel={resultado?.metaViavel}
        aporteNecessario={resultado?.aporteNecessario}
        aporteMensalAtual={aporteMensal.rawValue}
        totalBruto={resultado?.totalBruto}
      />

      <Button
        onClick={handleSimular}
        className="w-full h-12 text-base font-semibold hover:opacity-85"
        style={{ backgroundColor: '#A67C4E', color: '#FFFFFF' }}
      >
        Simular
      </Button>
    </div>
  )
}
