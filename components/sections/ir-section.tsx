"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface IrSectionProps {
  aliquotaIR: string
  onAliquotaIRChange: (v: string) => void
  modoIR: "fixo" | "tabela"
  onModoIRChange: (v: "fixo" | "tabela") => void
  comeCotas: boolean
  onComeCotasChange: (v: boolean) => void
}

export function IrSection({ aliquotaIR, onAliquotaIRChange, modoIR, onModoIRChange, comeCotas, onComeCotasChange }: IrSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4" style={{ borderColor: '#E3DCD0' }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-semibold" style={{ color: '#2E2A24' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▶</span>
        Imposto de Renda
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onModoIRChange("tabela")}
              className={`px-3 py-1.5 text-xs rounded-md border ${modoIR === "tabela" ? "border-[#A67C4E] bg-[#A67C4E]/10 text-[#A67C4E]" : "border-[#E3DCD0] text-[#6E6558]"}`}
            >
              Tabela Regressiva
            </button>
            <button
              type="button"
              onClick={() => onModoIRChange("fixo")}
              className={`px-3 py-1.5 text-xs rounded-md border ${modoIR === "fixo" ? "border-[#A67C4E] bg-[#A67C4E]/10 text-[#A67C4E]" : "border-[#E3DCD0] text-[#6E6558]"}`}
            >
              Alíquota Fixa
            </button>
          </div>
          {modoIR === "fixo" && (
            <div className="space-y-2">
              <Label htmlFor="aliquotaIR">Alíquota (%)</Label>
              <Input id="aliquotaIR" type="text" inputMode="decimal" value={aliquotaIR} onChange={(e) => onAliquotaIRChange(e.target.value)} placeholder="15" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch id="comeCotas" checked={comeCotas} onCheckedChange={onComeCotasChange} />
            <Label htmlFor="comeCotas" className="text-sm">Come-cotas semestrais (fundos)</Label>
          </div>
        </div>
      )}
    </div>
  )
}
