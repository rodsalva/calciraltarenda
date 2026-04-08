'use client'

import { useState } from 'react'
import { Empresa } from '@/lib/types'
import { formatBRL, formatPct } from '@/lib/calculos'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FieldGroup } from '@/components/ui/FieldGroup'

interface Props {
  empresas: Empresa[]
  totalReductor: number
  onAdd: (e: Omit<Empresa, 'id' | 'efPJ' | 'efPF' | 'redutor'>) => void
  onRemove: (id: string) => void
}

export function BlocoEmpresas({ empresas, totalReductor, onAdd, onRemove }: Props) {
  const [nome, setNome] = useState('')
  const [teto, setTeto] = useState<34 | 40 | 45>(34)
  const [lucro, setLucro] = useState(0)
  const [trib, setTrib] = useState(0)
  const [divpj, setDivpj] = useState(0)

  const handleAdd = () => {
    if (!nome.trim()) return
    onAdd({ nome: nome.trim(), teto, lucro, trib, divpj })
    setNome('')
    setTeto(34)
    setLucro(0)
    setTrib(0)
    setDivpj(0)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-50 text-amber-600 text-[10px] font-mono rounded border border-amber-200">3</span>
        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Redutor antibitributação — art. 16-B</span>
      </div>

      <p className="text-xs text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 mb-4 leading-relaxed">
        Se IRPJ+CSLL efetivo da PJ + IRPFM efetivo sobre dividendos ultrapassar o teto nominal (34%, 40% ou 45%), concede-se redutor à PF. Cadastre cada empresa da qual recebeu dividendos.
      </p>

      {/* Form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FieldGroup label="Nome da empresa">
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Holding XYZ Ltda."
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </FieldGroup>
          <FieldGroup
            label="Tipo de atividade"
            tooltip="Determina o teto nominal de IRPJ+CSLL: Bancos = 45%, Seguradoras/Financeiras = 40%, Demais = 34%."
          >
            <select
              value={teto}
              onChange={e => setTeto(parseInt(e.target.value) as 34 | 40 | 45)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value={34}>Demais empresas — 34%</option>
              <option value={40}>Seguradoras / Financeiras — 40%</option>
              <option value={45}>Bancos — 45%</option>
            </select>
          </FieldGroup>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <FieldGroup label="Lucro contábil" sub="Antes IRPJ e CSLL">
            <CurrencyInput value={lucro} onChange={setLucro} />
          </FieldGroup>
          <FieldGroup label="IRPJ + CSLL pagos" sub="No ano de referência">
            <CurrencyInput value={trib} onChange={setTrib} />
          </FieldGroup>
          <FieldGroup label="Dividendos desta PJ" sub="Recebidos em 2026">
            <CurrencyInput value={divpj} onChange={setDivpj} />
          </FieldGroup>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium rounded-lg border border-amber-200 transition-colors"
        >
          + Adicionar empresa
        </button>
      </div>

      {/* Lista */}
      {empresas.length > 0 && (
        <div className="space-y-2 mb-4">
          {empresas.map(e => (
            <div key={e.id} className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
              <span className="text-xs font-medium text-gray-800 flex-1 min-w-[80px]">{e.nome}</span>
              <div className="flex gap-3 text-[10px] font-mono text-gray-400 flex-wrap">
                <span>Ef. PJ: <span className="text-gray-600">{formatPct(e.efPJ)}</span></span>
                <span>Ef. PF: <span className="text-gray-600">{formatPct(e.efPF)}</span></span>
                <span>Teto: <span className="text-gray-600">{e.teto}%</span></span>
                <span>Redutor: <span className="text-amber-600 font-medium">{formatBRL(e.redutor)}</span></span>
              </div>
              <button
                onClick={() => onRemove(e.id)}
                className="text-[10px] px-2 py-1 border border-gray-300 text-red-500 rounded hover:border-red-400 transition-colors"
              >
                remover
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center px-3 py-2.5 bg-gray-100 rounded-lg">
        <span className="text-xs text-gray-500">Total do redutor</span>
        <span className="font-mono text-sm text-amber-600 font-medium">{formatBRL(totalReductor)}</span>
      </div>
    </div>
  )
}
