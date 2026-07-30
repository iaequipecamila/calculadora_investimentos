# Calculadora de Investimentos — Design Spec

## Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Library:** shadcn/ui (Button, Card, Input, Label, Switch, Chart)
- **Chart:** Recharts via shadcn Chart component
- **Theme:** next-themes (light mode with beige palette)
- **Language:** TypeScript

## Project Structure

```
calculadora_investimento/
├── app/
│   ├── layout.tsx            # Root layout with next-themes provider
│   ├── page.tsx              # Main single-page: form + results
│   └── globals.css           # Tailwind + shadcn theme variables (light beige)
├── components/
│   ├── ui/                   # Auto-generated shadcn components
│   ├── investment-form.tsx   # Form with masked inputs & toggle
│   ├── results-cards.tsx     # 3 result cards
│   └── evolution-chart.tsx   # AreaChart via Recharts/shadcn
├── lib/
│   ├── utils.ts              # cn() helper
│   └── calculations.ts       # Pure compound interest function
├── hooks/
│   └── use-currency-input.ts # R$ currency mask hook
├── package.json
├── tailwind.config.ts
├── components.json           # shadcn config
└── tsconfig.json
```

## Tema Visual (Light / Beige)

| Elemento | Classe Tailwind | Cor |
|----------|----------------|-----|
| Fundo | `bg-stone-100` | #f5f5f4 |
| Cards | `bg-white border-stone-200` | white / #e7e5e4 |
| Texto principal | `text-stone-900` | #1c1917 |
| Texto secundário | `text-stone-500` | #78716c |
| Destaque (accent) | `bg-emerald-600 text-emerald-600` | #059669 |
| Input focus ring | `ring-emerald-500` | #10b981 |
| Chart line | `stroke-emerald-500` | #10b981 |
| Chart fill | `fill-emerald-500/15` → `fill-emerald-500/5` | gradient |
| Switch active | `bg-emerald-500` | #10b981 |

Layout: coluna única, mobile-first, largura máxima de 480px centralizada em desktop.

## Componentes

### investment-form.tsx
- 4 campos controlados com máscara de R$:
  - Valor Inicial
  - Aporte Mensal
  - Taxa de Juros (com Switch ano/mês)
  - Período (em anos ou meses, atrelado ao switch)
- Botão "Simular" `w-full bg-emerald-600 hover:bg-emerald-500 text-white`
- Validação: todos campos obrigatórios, taxa > 0, período > 0

### use-currency-input.ts
- Hook que recebe `initialValue` e retorna `{ display, rawValue, onChange }`
- `display` = string formatada como moeda (ex: "R$ 1.000,00")
- `rawValue` = número puro para cálculos
- Usa `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Input `type="text"`, filtra não-dígitos na digitação

### results-cards.tsx
- Props: `totalBruto`, `totalInvestido`, `jurosGanhos`
- 3 Cards lado a lado em desktop (`grid grid-cols-3`), empilhados em mobile
- Total Bruto com fonte maior (`text-2xl font-bold text-emerald-600`)
- Valores formatados como moeda brasileira

### evolution-chart.tsx
- Props: `data: { mes: number; valor: number }[]`
- Usa `AreaChart` do Recharts via shadcn Chart
- Eixo X: meses (rotacionado se muitos labels)
- Eixo Y: valores abreviados (1k, 10k, 50k)
- Gradiente verde na área
- Tooltip com valor exato em R$
- Responsivo: ocupa 100% da largura

## Lógica de Cálculo

Arquivo `lib/calculations.ts` — função pura:

```typescript
interface InputParams {
  valorInicial: number;
  aporteMensal: number;
  taxa: number;       // percentual (ex: 12 para 12%)
  taxaTipo: 'ano' | 'mes';
  periodo: number;
  periodoTipo: 'anos' | 'meses';
}

interface Resultado {
  totalBruto: number;
  totalInvestido: number;
  jurosGanhos: number;
  evolucao: { mes: number; valor: number }[];
}
```

Fórmula:
```
taxaMensal = taxaTipo === 'ano' ? taxa / 100 / 12 : taxa / 100
nMeses = periodoTipo === 'anos' ? periodo * 12 : periodo
totalInvestido = valorInicial + (aporteMensal * nMeses)
totalBruto = valorInicial * (1 + taxaMensal)^nMeses + aporteMensal * (((1 + taxaMensal)^nMeses - 1) / taxaMensal)
jurosGanhos = totalBruto - totalInvestido
```

Evolução: array de `nMeses + 1` items (mês 0 = valorInicial).

## Data Flow

1. Usuário preenche form → estado local (`useState`)
2. Clica "Simular" → chama `calcular()` de `lib/calculations.ts`
3. Resultado salvo em estado → passa como props para `results-cards` e `evolution-chart`
4. Gráfico renderiza `AreaChart` com dados mensais

## Próximos Passos

1. Scaffold Next.js + instalar dependências
2. Configurar shadcn/ui com tema bege
3. Criar hook de máscara monetária
4. Criar função de cálculo
5. Criar formulário
6. Criar cards de resultado
7. Criar gráfico
8. Montar página principal
9. Testar manualmente
