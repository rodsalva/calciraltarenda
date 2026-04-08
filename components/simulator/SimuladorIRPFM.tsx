'use client'

import { useEffect } from 'react'
import { useSimulador } from '@/hooks/useSimulador'
import { calcIRPFTabela2026 } from '@/lib/calculos'
import { BlocoRendimentos } from './BlocoRendimentos'
import { BlocoCreditos } from './BlocoCreditos'
import { BlocoEmpresas } from './BlocoEmpresas'
import { BlocoMensal } from './BlocoMensal'
import { ResultadoPanel } from './ResultadoPanel'

export function SimuladorIRPFM() {
  const {
    rendimentos, creditos, empresas, resultado,
    setRendimento, setCredito, addEmpresa, removeEmpresa, reset,
  } = useSimulador()

  useEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    reset()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const rTrib = rendimentos.rPJ + rendimentos.rPF
  const irpfTabelaAuto = calcIRPFTabela2026(rTrib)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block font-mono text-[10px] tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded mb-3">
            Lei nº 15.270/2025 · art. 16-A e 16-B · DIRPF 2027
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 mb-1">
            Simulador IRPFM — tributação mínima sobre altas rendas
          </h1>
          <p className="text-sm text-zinc-500">
            Ano-calendário 2026 · Tabela progressiva 2026 · Redutor antibitributação incluído
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

          {/* Coluna esquerda */}
          <div className="space-y-4">
            <BlocoRendimentos
              rendimentos={rendimentos}
              baseIRPFM={resultado.base}
              onChange={setRendimento}
            />
            <BlocoCreditos
              creditos={creditos}
              totalCreditos={resultado.totalCreditos}
              irpfTabelaAuto={irpfTabelaAuto}
              onChange={setCredito}
            />
            <BlocoEmpresas
              empresas={empresas}
              totalReductor={resultado.totalReductor}
              onAdd={addEmpresa}
              onRemove={removeEmpresa}
            />
            <BlocoMensal />
          </div>

          {/* Coluna direita */}
          <ResultadoPanel resultado={resultado} creditos={creditos} />
        </div>

        {/* Footer */}
        <p className="text-[10px] text-zinc-600 mt-10 pt-6 border-t border-zinc-800 leading-relaxed">
          Simulador educacional baseado na Lei nº 15.270/2025 e Q&A da Receita Federal (dez/2025).
          Resultados estimativos — não substituem parecer de contador ou advogado tributarista habilitado.
          IRPF da tabela progressiva estimado automaticamente quando campo da DAA estiver em branco
          (tabela anual 2026: isento até R$ 88.200/ano = R$ 7.350/mês).
          O redutor do art. 16-B exige demonstrações financeiras auditadas da PJ.
        </p>
      </div>
    </div>
  )
}
