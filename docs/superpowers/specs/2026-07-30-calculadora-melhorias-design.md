# Design: Calculadora de Investimentos — Melhorias

## Visão Geral

Evolução modular da calculadora de investimentos existente (Next.js 16 + React 19 + Tailwind 4 + recharts + shadcn/ui). O escopo cobre IR, inflação, CDI como referência, metas, múltiplos cenários em abas, e visualizações expandidas. Sem exportação CSV.

## Arquitetura

Adições ao código existente seguindo os mesmos padrões. Nenhum refactor estrutural no layout principal. A abordagem é incremental: primeiro o core de cálculos, depois UI, depois integração.

## 1. Core de Cálculos (`lib/calculations.ts`)

### Interfaces estendidas

```ts
interface InputParams {
  valorInicial: number
  aporteMensal: number
  taxa: number
  taxaTipo: "ano" | "mes"
  periodo: number
  periodoTipo: "anos" | "meses"
  // Novos campos opcionais:
  aliquotaIR?: number          // null = tabela regressiva
  modoIR?: "fixo" | "tabela"  // default "tabela"
  comeCotas?: boolean          // aplicar IR a cada 6 meses (fundos)
  taxaInflacao?: number        // % ao ano, default 0
  modoMeta?: boolean
  valorMeta?: number
}

interface Resultado {
  totalBruto: number
  totalInvestido: number
  jurosGanhos: number
  evolucao: EvolucaoMes[]
  // Novos:
  totalLiquido: number
  totalIR: number
  aliquotaIREfetiva: number
  totalCorrigido: number
  mesesParaMeta?: number
}

interface EvolucaoMes {
  mes: number
  valor: number
  aporte: number
  ir?: number
  valorLiquido?: number
  valorCorrigido?: number
}
```

### Funções

- **`calcular(params)`** — existente, estendida. Se `aliquotaIR` ou modo tabela for fornecido, calcula IR por mês e no total. Se `taxaInflacao` for fornecida, calcula saldo corrigido.
- **`calcularIR(lucro, meses, aliquotaFixa?)`** — tabela regressiva se sem aliquota fixa: 22,5% (<180d), 20% (<360d), 17,5% (<720d), 15% (≥720d). Retorna `{ aliquota, valorIR }`.
- **`calcularInflacao(valores, taxaMensalInflacao)`** — aplica fator de correção mês a mês sobre os valores nominais.
- **`rentabilidadeReal(taxaNominal, taxaInflacao)`** — `(1+nominal)/(1+inflacao)-1`.
- **`calcularMeta(valorDesejado, valorInicial, aporteMensal, taxaMensal)`** — descobre n meses usando fórmula de juros compostos. Retorna `{ meses, viavel }`.

### Fluxo de cálculo

```
calcular(params)
  → calcula evolução mensal bruta (existente)
  → para cada mês, se IR ativo:
      se comeCotas: a cada 6 meses, calcularIR sobre lucro do período e debitar do saldo
      senão: calcularIR apenas no resgate (último mês) sobre o lucro total
  → para cada mês, se inflação ativa: aplicar correção sobre o saldo
  → se meta ativa: calcularMeta ao final
  → retorna Resultado completo
```

## 2. Formulário (`components/investment-form.tsx`)

### Estrutura de seções colapsáveis

O formulário ganha seções agrupadas por categoria. Cada seção é um componente separado em `components/sections/`:

```
components/sections/
  basic-section.tsx       → Dados Básicos (sempre aberto)
  ir-section.tsx          → Imposto de Renda (colapsável)
  inflation-section.tsx   → Inflação (colapsável)
  goal-section.tsx        → Meta (colapsável)
```

### Estados

Cada seção colapsável tem um estado `isOpen: boolean` gerenciado localmente com `useState`. A seção Dados Básicos não tem toggle.

### IR Section

- Switch "Calcular IR?" → se sim, exibe:
  - Radio: "Alíquota fixa" (input numérico %) / "Tabela regressiva" (automático)
  - Checkbox: "Come-cotas semestrais?" (para fundos — aplica IR a cada 6 meses sobre o lucro)

### Inflação Section

- Input: "IPCA estimado (% ao ano)"
- Checkbox: "Mostrar valores corrigidos pela inflação"

### Meta Section

- Switch "Definir meta?"
- Input: "Valor desejado (R$)"
- Exibe resultado: "Você atingirá sua meta em X anos e Y meses"

## 3. Sistema de Cenários (gerenciado em `page.tsx`)

### Estado

```ts
interface CenarioState {
  id: string
  nome: string
  params: InputParams
  resultado?: Resultado
}

// No page.tsx:
const [cenarios, setCenarios] = useState<CenarioState[]>([
  { id: "1", nome: "Cenário 1", params: defaultParams }
])
const [ativo, setAtivo] = useState("1")
```

### Abas

Componente `ScenarioTabs` renderiza abas horizontais. Cada aba mostra o nome editável. A última aba é "+" para adicionar novo cenário (ícone de "+").

- Trocar aba atualiza `ativo` e exibe o formulário + resultados daquele cenário.
- Cada aba tem botão "×" para remover (exceto se for o único cenário).
- Ao adicionar, clona o cenário ativo como template.

### Simulação

Cada cenário tem seu próprio botão "Simular" dentro do formulário. A simulação roda apenas para o cenário ativo.

## 4. Resultados e Visualizações

### Cards de Resultado (`components/results-cards.tsx`)

Atualizado para 6 cards em grid 3×2:

```
Total Bruto | Total Líquido | Juros Ganhos
Total Investido | Total IR | Total Corrigido
```

- Total Líquido: (totalBruto - totalIR)
- Total Corrigido: totalBruto corrigido pela inflação (apenas se inflação ativa)
- Total IR: soma do IR de todos os meses
- Destaque visual: Total Líquido em verde escuro (#6E8F63), Total IR em tom alerta

### Gráfico de Evolução (`components/evolution-chart.tsx`)

Mesmo componente base, mas:
- Quando inflação ativa, adiciona toggle "Nominal / Corrigido" que alterna entre `data[].valor` e `data[].valorCorrigido`
- Tooltip do gráfico mostra mês, valor nominal, valor corrigido (quando aplicável)

### Tabela Detalhada (`components/detail-table.tsx` — novo)

Tabela HTML com scroll horizontal. Colunas:

| Mês | Saldo Bruto | Aporte | IR | Saldo Líquido | Saldo Corrigido* |

*\*exibida apenas se inflação ativa*

- Formatação em moeda BRL
- Cabeçalho fixo, linhas com zebra striping
- Máximo de altura com rolagem vertical para períodos longos
- Abaixo da tabela, legenda explicativa dos parâmetros do cenário

## 5. Paleta de Cores para Cenários

```ts
const CENARIO_CORES = ["#A67C4E", "#6E8F63", "#C17A5A", "#5A7A9A", "#8A7FA3"]
```

Usadas para diferenciar cenários no futuro (se gráfico comparativo for adicionado) e como cor de destaque nas abas.

## Estrutura de Componentes Final

```
app/page.tsx                        ← estado dos cenários, abas
components/
  investment-form.tsx               ← container do formulário
  sections/
    basic-section.tsx               ← valor inicial, aporte, taxa, período
    ir-section.tsx                  ← IR fixo/tabela
    inflation-section.tsx           ← IPCA
    goal-section.tsx                ← meta
  results-cards.tsx                 ← 6 cards de resultado
  evolution-chart.tsx               ← gráfico com toggle nominal/corrigido
  detail-table.tsx                  ← tabela mês a mês (NOVO)
  scenario-tabs.tsx                 ← abas de cenário (NOVO)
lib/
  calculations.ts                   ← funções de cálculo estendidas
  utils.ts                          ← cn() existente
hooks/
  use-currency-input.ts             ← hook existente (inalterado)
```

## Não Escopo

- Exportação CSV (excluído pelo usuário)
- Gráfico comparativo entre cenários sobrepostos (será considerado em versão futura)
- Integração com APIs externas (IPCA automático)
- Dark mode
- Testes (a definir no plano de implementação)
