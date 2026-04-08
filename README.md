# Simulador IRPFM — Lei nº 15.270/2025

Simulador completo do IRPF Mínimo sobre Altas Rendas.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- Fontes: IBM Plex Mono + Sora (Google Fonts)
- Client-side only — sem banco de dados

---

## Setup rápido

```bash
# 1. Criar o projeto Next.js
npx create-next-app@latest irpfm --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
cd irpfm

# 2. Copiar todos os arquivos deste pacote para dentro da pasta irpfm/
#    Substituir os arquivos que o create-next-app gerou

# 3. Instalar dependências (já inclusas no package.json)
npm install

# 4. Rodar em dev
npm run dev
# Abrir http://localhost:3000
```

---

## Estrutura de arquivos

```
irpfm/
├── app/
│   ├── layout.tsx          ← fontes, metadata global
│   ├── page.tsx            ← entrada da app
│   └── globals.css         ← tailwind + scrollbar
├── components/
│   ├── simulator/
│   │   ├── SimuladorIRPFM.tsx    ← componente raiz
│   │   ├── BlocoRendimentos.tsx  ← bloco 1: 7 categorias de rendimento
│   │   ├── BlocoCreditos.tsx     ← bloco 2: 5 tipos de crédito compensável
│   │   ├── BlocoEmpresas.tsx     ← bloco 3: redutor art. 16-B por empresa
│   │   ├── BlocoMensal.tsx       ← simulador IRRF mensal dividendos
│   │   ├── ResultadoPanel.tsx    ← painel sticky de resultados
│   │   └── CenariosBar.tsx       ← 6 cenários pré-definidos
│   └── ui/
│       ├── CurrencyInput.tsx     ← input com máscara R$
│       ├── InfoTooltip.tsx       ← ícone ? com tooltip hover
│       └── FieldGroup.tsx        ← wrapper label + sub + input
├── hooks/
│   └── useSimulador.ts     ← estado central + useMemo para cálculo reativo
├── lib/
│   ├── calculos.ts         ← TODA a lógica fiscal (tabela 2026, alíquota, redutor)
│   ├── cenarios.ts         ← 6 cenários pré-definidos
│   └── types.ts            ← tipos TypeScript
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── postcss.config.mjs
```

---

## Lógica fiscal implementada

### Tabela progressiva anual 2026 (`lib/calculos.ts`)
```
Até R$ 88.200/ano   → 0% (isento — R$ 7.350/mês)
R$ 88.201–120.000   → 7,5%  − R$ 6.615,00
R$ 120.001–180.000  → 15%   − R$ 15.915,00
R$ 180.001–240.000  → 22,5% − R$ 29.415,00
Acima R$ 240.000    → 27,5% − R$ 42.615,00
```

### Alíquota IRPFM (art. 16-A)
```
Base ≤ R$ 600.000        → 0%
R$ 600.001–1.200.000     → (base ÷ 60.000) − 10  [em %]
Base ≥ R$ 1.200.000      → 10%
```

### Redutor antibitributação (art. 16-B)
```
Redutor = (efPJ + efPF − teto) × dividendosPJ   [se positivo]

efPJ = IRPJ+CSLL pagos / lucro contábil
efPF = incremento do IRPFM por incluir dividendos / total dividendos
teto = 34% (demais), 40% (seguradoras/financeiras), 45% (bancos)
```

### IRRF mensal dividendos (art. 6º-A)
```
Dividendos/mês > R$ 50.000 por fonte pagadora → 10% sobre o total do mês
```

---

## Cenários pré-definidos

| Cenário | Base IRPFM | IRPFM bruto |
|---|---|---|
| Sócio renda média | R$ 520k | R$ 0 (isento) |
| Sócio alta renda | R$ 1,2M | R$ 120k (coberto por créditos) |
| Executivo + dividendos | R$ 860k | R$ 37k (coberto) |
| Investidor misto | R$ 860k | R$ 37k (coberto) |
| Offshore + dividendos | R$ 900k | R$ 45k (coberto) |
| Puro dividendos | R$ 1M | **R$ 66.667 adicional** ← caso crítico |

---

## Próximos passos sugeridos para Claude Code

1. **Exportar PDF** — usar `jspdf` + `html2canvas` para gerar relatório
2. **Compartilhar simulação** — serializar state em URL (query params ou base64)
3. **Validações** — alertas quando dividendos mensais ultrapassam R$ 50k
4. **Gráfico de carga efetiva** — comparar antes/depois do IRPFM com Recharts
5. **Deploy** — `vercel deploy` ou `netlify deploy`

---

## Notas legais
Baseado na Lei nº 15.270/2025 e Q&A da Receita Federal (dezembro/2025).
Resultados estimativos — não substituem parecer de contador ou advogado tributarista.
