# Design: Calculadora de Investimentos — Informações Ricas

## Visão Geral

Duas adições focadas em informação à calculadora existente:
1. **Aporte necessário na seção Meta** — calcula o valor mensal necessário para atingir a meta no período atual
2. **Composition Chart** — gráfico de donut mostrando a proporção entre aportes e juros no patrimônio final

## 1. Aporte Necessário na Seção Meta

### Cálculo (`lib/calculations.ts`)

Nova função:

```ts
export function calcularAporteNecessario(
  valorDesejado: number,
  valorInicial: number,
  nMeses: number,
  taxaMensal: number
): number | null
```

**Fórmula** (juros compostos, PMT de série uniforme):

```
PMT = (FV - PV × (1+r)^n) × r / ((1+r)^n - 1)
```

Onde:
- `FV` = valorDesejado
- `PV` = valorInicial
- `n` = nMeses (período atual da simulação)
- `r` = taxaMensal

**Edge cases:**
- Se `valorInicial >= valorDesejado` → retorna 0 (não precisa aportar)
- Se `nMeses <= 0` → retorna null
- Se `taxaMensal === 0` → retorna `(valorDesejado - valorInicial) / nMeses` (divisão simples)
- Se `(1+r)^n` é muito grande (>1e308, overflow JS) → retorna null
- Se o denominador `((1+r)^n - 1)` é 0 ou negativo → retorna null

### Interface `Resultado`

Adicionar campo:

```ts
aporteNecessario?: number | null
```

Em `calcular()`, quando `modoMeta && valorMeta && nMeses > 0`:

```ts
aporteNecessario = calcularAporteNecessario(valorMeta, valorInicial, nMeses, taxaMensal)
```

### Display (`components/sections/goal-section.tsx`)

Nova prop: `aporteNecessario?: number | null`

Exibir abaixo da mensagem de meta atingida:

```
Aporte atual: R$ 500/mês
Aporte necessário: R$ 350/mês para atingir em 30 anos
```

- Compara `aporteNecessario` com `aporteMensal` atual
- Se `aporteNecessario === 0`: mostra "Meta já atingida"
- Se `aporteNecessario <= aporteMensal`: tom verde, "Aporte atual já suficiente"
- Se `aporteNecessario > aporteMensal`: tom neutro, mostra ambos valores
- Se `aporteNecessario === null`: mostra apenas aporte atual sem comparação

## 2. Composition Chart

### Componente novo: `components/composition-chart.tsx`

Gráfico de rosca (donut) com Recharts `PieChart`. Props:

```ts
interface CompositionChartProps {
  totalInvestido: number
  jurosGanhos: number
}
```

### Dados

- **Aportes (totalInvestido)** — cor `#C4A882` (bronze claro)
- **Juros (jurosGanhos)** — cor `#6E8F63` (verde musgo)

### Layout

- Largura máxima ~260px, centralizado
- Título: "Composição do Patrimônio"
- Labels internos com nome + percentual
- Tooltip com valor em R$
- Raio interno 60%, externo 90%
- Abaixo do gráfico de evolução, antes da tabela detalhada
- Se `jurosGanhos <= 0` (sem crescimento), não renderiza o gráfico

### Integração (`app/page.tsx`)

Adicionar:

```tsx
{cenarioAtivo.resultado && (
  <>
    <ResultsCards />
    <EvolutionChart />
    <CompositionChart
      totalInvestido={cenarioAtivo.resultado.totalInvestido}
      jurosGanhos={cenarioAtivo.resultado.jurosGanhos}
    />
    <DetailTable />
  </>
)}
```

## 3. Ajustes na Seção Meta

### Props estendidas da `GoalSection`

```ts
interface GoalSectionProps {
  valorMeta: { display: string; rawValue: number }
  onValorMetaChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ativo: boolean
  onAtivoChange: (v: boolean) => void
  mesesParaMeta?: number
  metaViavel?: boolean
  aporteNecessario?: number | null  // NOVO
  aporteMensalAtual?: number        // NOVO
}
```

## Não Escopo

- Gráfico comparativo entre cenários
- Exportação CSV
- Modo inverso separado (aporte necessário como feature independente)
- Anualização da tabela
- LocalStorage / persistência
