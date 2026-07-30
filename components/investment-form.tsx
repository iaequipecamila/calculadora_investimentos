"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCurrencyInput } from "@/hooks/use-currency-input"
import type { InputParams } from "@/lib/calculations"

interface InvestmentFormProps {
  onSimular: (params: InputParams) => void
}

export function InvestmentForm({ onSimular }: InvestmentFormProps) {
  const valorInicial = useCurrencyInput(0)
  const aporteMensal = useCurrencyInput(0)
  const [taxa, setTaxa] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [taxaTipo, setTaxaTipo] = useState<"ano" | "mes">("ano")

  const periodoTipo = taxaTipo === "ano" ? "anos" : "meses"

  function handleSimular() {
    const params: InputParams = {
      valorInicial: valorInicial.rawValue,
      aporteMensal: aporteMensal.rawValue,
      taxa: parseFloat(taxa.replace(",", ".")) || 0,
      taxaTipo,
      periodo: parseInt(periodo, 10) || 0,
      periodoTipo,
    }
    onSimular(params)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="valorInicial">Valor Inicial</Label>
        <Input
          id="valorInicial"
          type="text"
          inputMode="numeric"
          value={valorInicial.display}
          onChange={valorInicial.onChange}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aporteMensal">Aporte Mensal</Label>
        <Input
          id="aporteMensal"
          type="text"
          inputMode="numeric"
          value={aporteMensal.display}
          onChange={aporteMensal.onChange}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxa">Taxa de Juros</Label>
        <div className="flex items-center gap-3">
          <Input
            id="taxa"
            type="text"
            inputMode="decimal"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            placeholder="12"
            className="flex-1"
          />
          <div className="flex items-center gap-2 text-sm shrink-0" style={{ color: '#6E6558' }}>
            <span className="font-medium" style={{ color: taxaTipo === "ano" ? '#A67C4E' : '#6E6558' }}>ano</span>
            <Switch
              checked={taxaTipo === "mes"}
              onCheckedChange={(v) => setTaxaTipo(v ? "mes" : "ano")}
            />
            <span className="font-medium" style={{ color: taxaTipo === "mes" ? '#A67C4E' : '#6E6558' }}>mês</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="periodo">
          Período ({periodoTipo})
        </Label>
        <Input
          id="periodo"
          type="text"
          inputMode="numeric"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          placeholder={periodoTipo === "anos" ? "10" : "120"}
        />
      </div>

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
