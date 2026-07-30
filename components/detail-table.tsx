"use client"

import { useState } from "react"
import type { EvolucaoMes } from "@/lib/calculations"

interface DetailTableProps {
  evolucao: EvolucaoMes[]
  inflacaoAtiva?: boolean
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const PREVIEW_ROWS = 5

export function DetailTable({ evolucao, inflacaoAtiva }: DetailTableProps) {
  const [expandido, setExpandido] = useState(false)

  if (!evolucao || evolucao.length === 0) return null

  const linhasVisiveis = expandido
    ? evolucao
    : evolucao.length > PREVIEW_ROWS
    ? [...evolucao.slice(0, PREVIEW_ROWS), ...evolucao.slice(-1)]
    : evolucao

  return (
    <div>
      <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E3DCD0', backgroundColor: '#FFFFFF' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}>
            <thead>
              <tr style={{ backgroundColor: '#F5F1EA', borderBottom: '1px solid #E3DCD0' }}>
                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" style={{ color: '#6E6558' }}>Mês</th>
                <th className="px-3 py-2 text-right font-semibold whitespace-nowrap hidden sm:table-cell" style={{ color: '#6E6558' }}>Bruto</th>
                <th className="px-3 py-2 text-right font-semibold whitespace-nowrap hidden sm:table-cell" style={{ color: '#6E6558' }}>Aporte</th>
                <th className="px-3 py-2 text-right font-semibold whitespace-nowrap" style={{ color: '#6E6558' }}>IR</th>
                <th className="px-3 py-2 text-right font-semibold whitespace-nowrap" style={{ color: '#6E6558' }}>Líquido</th>
                {inflacaoAtiva && (
                  <th className="px-3 py-2 text-right font-semibold whitespace-nowrap hidden sm:table-cell" style={{ color: '#6E6558' }}>Corrigido</th>
                )}
              </tr>
            </thead>
            <tbody>
              {linhasVisiveis.map((item, i) => {
                const isLast = !expandido && i === linhasVisiveis.length - 1 && i !== 0
                return (
                  <tr
                    key={item.mes}
                    style={{
                      borderBottom: '1px solid #E3DCD0',
                      backgroundColor: isLast ? '#FAF8F5' : i % 2 === 0 ? '#FFFFFF' : '#FAF8F5',
                      fontWeight: isLast ? 600 : undefined,
                    }}
                  >
                    <td className="px-3 py-1.5 text-left whitespace-nowrap" style={{ color: '#2E2A24' }}>{item.mes}</td>
                    <td className="px-3 py-1.5 text-right whitespace-nowrap hidden sm:table-cell" style={{ color: '#2E2A24' }}>{formatBRL(item.valor)}</td>
                    <td className="px-3 py-1.5 text-right whitespace-nowrap hidden sm:table-cell" style={{ color: '#6E6558' }}>{formatBRL(item.aporte)}</td>
                    <td className="px-3 py-1.5 text-right whitespace-nowrap" style={{ color: item.ir && item.ir > 0 ? '#C17A5A' : '#6E6558' }}>{item.ir ? formatBRL(item.ir) : "—"}</td>
                    <td className="px-3 py-1.5 text-right whitespace-nowrap" style={{ color: '#2E2A24' }}>
                      {item.valorLiquido ? formatBRL(item.valorLiquido) : "—"}
                    </td>
                    {inflacaoAtiva && (
                      <td className="px-3 py-1.5 text-right whitespace-nowrap hidden sm:table-cell" style={{ color: '#5A7A9A' }}>
                        {item.valorCorrigido ? formatBRL(item.valorCorrigido) : "—"}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {!expandido && evolucao.length > PREVIEW_ROWS + 1 && (
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="w-full text-center py-2 text-sm font-medium rounded-b-lg border-x border-b transition-colors hover:opacity-80"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD0', color: '#A67C4E' }}
        >
          Ver mais detalhes ({evolucao.length - PREVIEW_ROWS - 1} meses ocultos)
        </button>
      )}
    </div>
  )
}
