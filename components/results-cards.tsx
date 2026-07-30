"use client"

import { useState, useEffect, useRef } from "react"
import type { Resultado } from "@/lib/calculations"

interface ResultsCardsProps {
  resultado: Resultado
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  useEffect(() => {
    const from = prevRef.current
    prevRef.current = value
    const start = performance.now()
    const dur = 700
    let raf: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{formatBRL(Math.round(display * 100) / 100)}</>
}

export function ResultsCards({ resultado }: ResultsCardsProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E3DCD0',
    borderRadius: '9px',
    textAlign: 'center',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#9A9083',
    fontWeight: 600,
    marginBottom: '6px',
    whiteSpace: 'nowrap',
  }

  const valueStyle = (color: string, big = false): React.CSSProperties => ({
    fontFamily: 'var(--font-fraunces)',
    fontSize: big ? 'clamp(1.25rem, 3.5vw, 1.4rem)' : 'clamp(1.1rem, 2.5vw, 1.2rem)',
    fontWeight: 600,
    lineHeight: 1.3,
    color,
    whiteSpace: 'nowrap',
    fontStyle: big ? 'italic' : 'normal',
  })

  const showCorrigido = resultado.totalCorrigido !== resultado.totalBruto && resultado.totalCorrigido > 0

  const cards = [
    { label: "Total Bruto", value: resultado.totalBruto, color: '#A67C4E', big: true },
    { label: "Total Líquido", value: resultado.totalLiquido, color: '#6E8F63', big: true },
    { label: "Juros Ganhos", value: resultado.jurosGanhos, color: '#2E2A24' },
    { label: "Total Investido", value: resultado.totalInvestido, color: '#2E2A24' },
    { label: "IR", value: resultado.totalIR, color: '#C17A5A', footnote: `${resultado.aliquotaIREfetiva}% efetiva` },
    { label: showCorrigido ? "Valor Corrigido" : "Alíquota", value: showCorrigido ? resultado.totalCorrigido : resultado.aliquotaIREfetiva, color: '#5A7A9A', footnote: showCorrigido ? "poder de compra" : "IR efetiva", isPercent: !showCorrigido },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <div key={card.label} className="card-hover animate-fade-up p-6 sm:p-7" style={{ ...cardStyle, animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
          <p style={labelStyle}>{card.label}</p>
          <p style={valueStyle(card.color, card.big)}>
            {card.isPercent ? `${card.value}%` : <AnimatedNumber value={typeof card.value === 'number' ? card.value : 0} />}
          </p>
          {card.footnote && (
            <p style={{ fontSize: '0.6rem', color: '#9A9083' }}>{card.footnote}</p>
          )}
        </div>
      ))}
    </div>
  )
}
