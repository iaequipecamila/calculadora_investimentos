import type { Resultado } from "@/lib/calculations"

interface ResultsCardsProps {
  resultado: Resultado | null
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function ResultsCards({ resultado }: ResultsCardsProps) {
  if (!resultado) return null

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E3DCD0',
    borderRadius: '9px',
    padding: '18px 20px',
    textAlign: 'center',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div style={cardStyle}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#9A9083', fontWeight: 600, marginBottom: '6px' }}>
          Total Bruto
        </p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '2rem', fontWeight: 600, lineHeight: 1.1, color: '#A67C4E' }}>
          {formatBRL(resultado.totalBruto)}
        </p>
      </div>

      <div style={cardStyle}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#9A9083', fontWeight: 600, marginBottom: '6px' }}>
          Total Investido
        </p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.1, color: '#2E2A24' }}>
          {formatBRL(resultado.totalInvestido)}
        </p>
      </div>

      <div style={cardStyle}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#9A9083', fontWeight: 600, marginBottom: '6px' }}>
          Juros Ganhos
        </p>
        <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.1, color: '#6E8F63' }}>
          {formatBRL(resultado.jurosGanhos)}
        </p>
      </div>
    </div>
  )
}
