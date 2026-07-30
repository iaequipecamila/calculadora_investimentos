"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GoalRing } from "@/components/goal-ring"

interface GoalSectionProps {
  valorMeta: { display: string; rawValue: number }
  onValorMetaChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ativo: boolean
  onAtivoChange: (v: boolean) => void
  mesesParaMeta?: number
  metaViavel?: boolean
  aporteNecessario?: number | null
  aporteMensalAtual?: number
  totalBruto?: number
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function GoalSection({ valorMeta, onValorMetaChange, ativo, onAtivoChange, mesesParaMeta, metaViavel, aporteNecessario, aporteMensalAtual, totalBruto }: GoalSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4" style={{ borderColor: '#E3DCD0' }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-semibold" style={{ color: '#2E2A24' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▶</span>
        Meta de Investimento
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Switch id="metaAtivo" checked={ativo} onCheckedChange={onAtivoChange} />
            <Label htmlFor="metaAtivo" className="text-sm">Definir meta</Label>
          </div>
          {ativo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="valorMeta">Valor desejado</Label>
                <Input id="valorMeta" type="text" inputMode="numeric" value={valorMeta.display} onChange={onValorMetaChange} placeholder="R$ 0,00" />
              </div>
              {metaViavel === false && (
                <p className="text-sm font-medium" style={{ color: '#C17A5A' }}>
                  Meta não atingível com esses parâmetros
                </p>
              )}
              {metaViavel !== false && totalBruto !== undefined && valorMeta.rawValue > 0 && (
                <div className="animate-fade-up">
                  <GoalRing valorMeta={valorMeta.rawValue} totalBruto={totalBruto} />
                </div>
              )}
              {mesesParaMeta !== undefined && (
                <p className="text-sm font-medium text-center animate-count-in" style={{ color: '#6E8F63' }}>
                  Meta atingida em {Math.floor(mesesParaMeta / 12)} anos e {mesesParaMeta % 12} meses
                </p>
              )}
              {metaViavel === true && mesesParaMeta === undefined && (
                <p className="text-sm font-medium text-center animate-count-in" style={{ color: '#6E8F63' }}>
                  Meta já atingida com o valor inicial
                </p>
              )}
              {(aporteNecessario !== undefined && aporteNecessario !== null && mesesParaMeta !== undefined && aporteMensalAtual !== undefined) && (
                <div className="pt-2 border-t mt-2 space-y-1 animate-count-in" style={{ borderColor: '#E3DCD0' }}>
                  <p className="text-xs" style={{ color: '#9A9083' }}>
                    Aporte atual: {formatBRL(aporteMensalAtual)}/mês
                  </p>
                  <p className="text-xs" style={{ color: aporteNecessario <= aporteMensalAtual ? '#6E8F63' : '#C17A5A' }}>
                    {aporteNecessario === 0
                      ? "Meta já atingida sem novos aportes"
                      : aporteNecessario <= aporteMensalAtual
                        ? `Aporte atual é suficiente (necessário ${formatBRL(aporteNecessario)}/mês)`
                        : `Aporte necessário: ${formatBRL(aporteNecessario)}/mês para atingir em ${Math.floor(mesesParaMeta / 12)} anos e ${mesesParaMeta % 12} meses`
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
