"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BasicSectionProps {
  valorInicial: { display: string; rawValue: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
  aporteMensal: { display: string; rawValue: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
  taxa: string
  onTaxaChange: (v: string) => void
  taxaTipo: "ano" | "mes"
  onTaxaTipoChange: (v: "ano" | "mes") => void
  periodo: string
  onPeriodoChange: (v: string) => void
}

export function BasicSection({ valorInicial, aporteMensal, taxa, onTaxaChange, taxaTipo, onTaxaTipoChange, periodo, onPeriodoChange }: BasicSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="valorInicial">Valor Inicial</Label>
        <Input id="valorInicial" type="text" inputMode="numeric" value={valorInicial.display} onChange={valorInicial.onChange} placeholder="R$ 0,00" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aporteMensal">Aporte Mensal</Label>
        <Input id="aporteMensal" type="text" inputMode="numeric" value={aporteMensal.display} onChange={aporteMensal.onChange} placeholder="R$ 0,00" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taxa">Taxa de Juros</Label>
        <div className="flex items-center gap-3">
          <Input id="taxa" type="text" inputMode="decimal" value={taxa} onChange={(e) => onTaxaChange(e.target.value)} placeholder="12" className="flex-1" />
          <div className="flex items-center gap-2 text-sm shrink-0" style={{ color: '#6E6558' }}>
            <span className="font-medium" style={{ color: taxaTipo === "ano" ? '#A67C4E' : '#6E6558' }}>ano</span>
            <Switch checked={taxaTipo === "mes"} onCheckedChange={(v) => onTaxaTipoChange(v ? "mes" : "ano")} />
            <span className="font-medium" style={{ color: taxaTipo === "mes" ? '#A67C4E' : '#6E6558' }}>mês</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="periodo">Período ({taxaTipo === "ano" ? "anos" : "meses"})</Label>
        <Input id="periodo" type="text" inputMode="numeric" value={periodo} onChange={(e) => onPeriodoChange(e.target.value)} placeholder={taxaTipo === "ano" ? "10" : "120"} />
      </div>
    </>
  )
}
