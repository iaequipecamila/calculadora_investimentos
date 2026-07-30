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

export function ResultsCards({ resultado }: ResultsCardsProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E3DCD0',
    borderRadius: '9px',
    padding: '10px 8px',
    textAlign: 'center',
    overflow: 'hidden',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.55rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#9A9083',
    fontWeight: 600,
    marginBottom: '2px',
    whiteSpace: 'nowrap',
  }

  const valueStyle = (color: string, big = false): React.CSSProperties => ({
    fontFamily: 'var(--font-fraunces)',
    fontSize: big ? '1rem' : '0.85rem',
    fontWeight: 600,
    lineHeight: 1.2,
    color,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })

  const showCorrigido = resultado.totalCorrigido !== resultado.totalBruto && resultado.totalCorrigido > 0

  return (
    <div className="grid grid-cols-3 gap-1.5">
      <div style={cardStyle}>
        <p style={labelStyle}>Total Bruto</p>
        <p style={valueStyle('#A67C4E', true)}>{formatBRL(resultado.totalBruto)}</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Líquido</p>
        <p style={valueStyle('#6E8F63', true)}>{formatBRL(resultado.totalLiquido)}</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Juros Ganhos</p>
        <p style={valueStyle('#2E2A24')}>{formatBRL(resultado.jurosGanhos)}</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Investido</p>
        <p style={valueStyle('#2E2A24')}>{formatBRL(resultado.totalInvestido)}</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>IR</p>
        <p style={valueStyle('#C17A5A')}>{formatBRL(resultado.totalIR)}</p>
        <p style={{ fontSize: '0.5rem', color: '#9A9083' }}>{resultado.aliquotaIREfetiva}% efetiva</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>{showCorrigido ? "Valor Corrigido" : "Alíquota"}</p>
        <p style={valueStyle('#5A7A9A')}>
          {showCorrigido ? formatBRL(resultado.totalCorrigido) : `${resultado.aliquotaIREfetiva}%`}
        </p>
        <p style={{ fontSize: '0.5rem', color: '#9A9083' }}>
          {showCorrigido ? "poder de compra" : "IR efetiva"}
        </p>
      </div>
    </div>
  )
}
