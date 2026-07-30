"use client"

interface GoalRingProps {
  valorMeta: number
  totalBruto: number
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const TAMANHO = 140
const RAIO = 54
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

export function GoalRing({ valorMeta, totalBruto }: GoalRingProps) {
  const progresso = Math.min(totalBruto / valorMeta, 1)
  const porcento = Math.round(progresso * 100)
  const offset = CIRCUNFERENCIA * (1 - progresso)

  const cor = porcento >= 100 ? '#6E8F63' : porcento >= 75 ? '#A67C4E' : '#C17A5A'

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <svg width={TAMANHO} height={TAMANHO} viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}>
        <circle
          cx={TAMANHO / 2}
          cy={TAMANHO / 2}
          r={RAIO}
          fill="none"
          stroke="#EEE8DE"
          strokeWidth={8}
        />
        <circle
          cx={TAMANHO / 2}
          cy={TAMANHO / 2}
          r={RAIO}
          fill="none"
          stroke={cor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.3s',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
        <text
          x={TAMANHO / 2}
          y={TAMANHO / 2 - 6}
          textAnchor="middle"
          fill="#2E2A24"
          fontSize="1.6rem"
          fontWeight={600}
          fontFamily="var(--font-fraunces)"
        >
          {porcento}%
        </text>
        <text
          x={TAMANHO / 2}
          y={TAMANHO / 2 + 16}
          textAnchor="middle"
          fill="#6E6558"
          fontSize="0.6rem"
          fontWeight={500}
        >
          da meta
        </text>
      </svg>
      {porcento < 100 && (
        <p className="text-xs" style={{ color: '#9A9083' }}>
          {formatBRL(totalBruto)} de {formatBRL(valorMeta)}
        </p>
      )}
    </div>
  )
}
