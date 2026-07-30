"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface InflationSectionProps {
  taxaInflacao: string
  onTaxaInflacaoChange: (v: string) => void
  ativo: boolean
  onAtivoChange: (v: boolean) => void
}

export function InflationSection({ taxaInflacao, onTaxaInflacaoChange, ativo, onAtivoChange }: InflationSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4" style={{ borderColor: '#E3DCD0' }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-semibold" style={{ color: '#2E2A24' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▶</span>
        Inflação
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Switch id="inflacaoAtivo" checked={ativo} onCheckedChange={onAtivoChange} />
            <Label htmlFor="inflacaoAtivo" className="text-sm">Corrigir pela inflação</Label>
          </div>
          {ativo && (
            <div className="space-y-2">
              <Label htmlFor="taxaInflacao">IPCA estimado (% ao ano)</Label>
              <Input id="taxaInflacao" type="text" inputMode="decimal" value={taxaInflacao} onChange={(e) => onTaxaInflacaoChange(e.target.value)} placeholder="6" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
