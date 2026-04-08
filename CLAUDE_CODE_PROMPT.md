# Simulador IRPFM — Instruções para Claude Code

Crie um produto web completo chamado **Simulador IRPFM** — tributação mínima sobre altas rendas conforme a Lei nº 15.270/2025.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (opcional para componentes base)
- Sem banco de dados — tudo client-side

## Estrutura de arquivos a criar

```
irpfm/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico (pode deixar padrão)
├── components/
│   ├── simulator/
│   │   ├── SimuladorIRPFM.tsx       ← componente principal
│   │   ├── BlocoRendimentos.tsx     ← bloco 1: inputs de rendimentos
│   │   ├── BlocoCreditos.tsx        ← bloco 2: IR a compensar
│   │   ├── BlocoEmpresas.tsx        ← bloco 3: redutor art. 16-B
│   │   ├── BlocoMensal.tsx          ← simulador IRRF mensal
│   │   ├── ResultadoPanel.tsx       ← painel de resultados (sticky)
│   │   └── CenariosBar.tsx          ← botões de cenários prontos
│   └── ui/
│       ├── CurrencyInput.tsx        ← input com máscara R$
│       ├── InfoTooltip.tsx          ← ícone ? com tooltip
│       └── SumRow.tsx               ← linha de totalização
├── lib/
│   ├── calculos.ts                  ← TODA a lógica de cálculo
│   ├── cenarios.ts                  ← cenários pré-definidos
│   └── types.ts                     ← tipos TypeScript
├── hooks/
│   └── useSimulador.ts              ← estado e lógica central
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Conteúdo de cada arquivo está nos arquivos anexos deste pacote.

Comando para iniciar:
```bash
npx create-next-app@latest irpfm --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
cd irpfm
# Copiar todos os arquivos abaixo
npm run dev
```
