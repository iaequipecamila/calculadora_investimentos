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
    padding: '14px 16px',
    textAlign: 'center',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.62rem',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: '#9A9083',
    fontWeight: 600,
    marginBottom: '4px',
  }

  const showCorrigido = resultado.totalCorrigido !== resultado.totalBruto && resultado.totalCorrigido > 0

  return (
    <div className="grid grid-cols-3 gap-2">
      <div style={cardStyle}>
        <p style={labelStyle}>Total Bruto</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.1, color: '#A67C4E' }}>
          {formatBRL(resultado.totalBruto)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Líquido</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.1, color: '#6E8F63' }}>
          {formatBRL(resultado.totalLiquido)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Juros Ganhos</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#2E2A24' }}>
          {formatBRL(resultado.jurosGanhos)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Investido</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#2E2A24' }}>
          {formatBRL(resultado.totalInvestido)}
        </p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>IR</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#C17A5A' }}>
          {formatBRL(resultado.totalIR)}
        </p>
        <p style={{ fontSize: '0.6rem', color: '#9A9083' }}>{resultado.aliquotaIREfetiva}% efetiva</p>
      </div>
      <div style={cardStyle}>
        <p style={labelStyle}>{showCorrigido ? "Valor Corrigido" : "Alíquota"}</p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.1, color: '#5A7A9A' }}>
          {showCorrigido ? formatBRL(resultado.totalCorrigido) : `${resultado.aliquotaIREfetiva}%`}
        </p>
        <p style={{ fontSize: '0.6rem', color: '#9A9083' }}>
          {showCorrigido ? "poder de compra" : "IR efetiva"}
        </p>
      </div>
    </div>
  )
}
