'use client'

import { CenarioKey } from '@/lib/types'
import { CENARIOS, CENARIO_KEYS } from '@/lib/cenarios'

interface Props {
  onLoad: (key: CenarioKey) => void
  onReset: () => void
  activeCenario: CenarioKey | null
}

export function CenariosBar({ onLoad, onReset, activeCenario }: Props) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-2">
        Carregar cenário
      </div>
      <div className="flex flex-wrap gap-2">
        {CENARIO_KEYS.map(key => (
          <button
            key={key}
            onClick={() => onLoad(key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              activeCenario === key
                ? 'bg-amber-500/15 border-amber-500/60 text-amber-400'
                : 'bg-zinc-900 border-zinc-700 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400'
            }`}
          >
            {CENARIOS[key].label}
          </button>
        ))}
        <button
          onClick={onReset}
          className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-red-500/50 hover:text-red-400 text-zinc-500 rounded-lg transition-colors"
        >
          Limpar
        </button>
      </div>
    </div>
  )
}
