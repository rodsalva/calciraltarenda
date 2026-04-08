'use client'

import { useState, useCallback, useMemo } from 'react'
import { Rendimentos, Creditos, Empresa, SimuladorState, CenarioKey } from '@/lib/types'
import { calcularIRPFM } from '@/lib/calculos'
import { CENARIOS } from '@/lib/cenarios'

const DEFAULT_RENDIMENTOS: Rendimentos = {
  rPJ: 0, rPF: 0, rDiv: 0, rOff: 0,
  rExcl: 0, rGC: 0, rOut: 0, rIsen: 0,
}

const DEFAULT_CREDITOS: Creditos = {
  cDAA: 0, cDiv: 0, cAplic: 0, cOff: 0, cOut: 0,
}

export function useSimulador() {
  const [rendimentos, setRendimentos] = useState<Rendimentos>(DEFAULT_RENDIMENTOS)
  const [creditos, setCreditos] = useState<Creditos>(DEFAULT_CREDITOS)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [activeCenario, setActiveCenario] = useState<CenarioKey | null>(null)

  const resultado = useMemo(
    () => calcularIRPFM(rendimentos, creditos, empresas),
    [rendimentos, creditos, empresas]
  )

  const setRendimento = useCallback((key: keyof Rendimentos, value: number) => {
    setRendimentos(prev => ({ ...prev, [key]: value }))
  }, [])

  const setCredito = useCallback((key: keyof Creditos, value: number) => {
    setCreditos(prev => ({ ...prev, [key]: value }))
  }, [])

  const addEmpresa = useCallback((empresa: Omit<Empresa, 'id' | 'efPJ' | 'efPF' | 'redutor'>) => {
    const novaEmpresa: Empresa = {
      ...empresa,
      id: crypto.randomUUID(),
      efPJ: 0,
      efPF: 0,
      redutor: 0,
    }
    setEmpresas(prev => [...prev, novaEmpresa])
  }, [])

  const removeEmpresa = useCallback((id: string) => {
    setEmpresas(prev => prev.filter(e => e.id !== id))
  }, [])

  const loadCenario = useCallback((key: CenarioKey) => {
    const cenario = CENARIOS[key]
    setRendimentos({ ...DEFAULT_RENDIMENTOS, ...cenario.rendimentos })
    setCreditos({ ...DEFAULT_CREDITOS, ...cenario.creditos })
    setEmpresas([])
    setActiveCenario(key)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const reset = useCallback(() => {
    setRendimentos(DEFAULT_RENDIMENTOS)
    setCreditos(DEFAULT_CREDITOS)
    setEmpresas([])
    setActiveCenario(null)
  }, [])

  // Empresas com redutores calculados (vêm do resultado)
  const empresasComReductor = useMemo(() => {
    return empresas.map(e => ({
      ...e,
      efPF: resultado.efPF,
      efPJ: e.lucro > 0 ? e.trib / e.lucro : 0,
      redutor: (() => {
        const efPJ = e.lucro > 0 ? e.trib / e.lucro : 0
        const soma = efPJ + resultado.efPF
        const teto = e.teto / 100
        return soma > teto ? Math.max(0, (soma - teto) * e.divpj) : 0
      })(),
    }))
  }, [empresas, resultado.efPF])

  return {
    rendimentos,
    creditos,
    empresas: empresasComReductor,
    resultado,
    activeCenario,
    setRendimento,
    setCredito,
    addEmpresa,
    removeEmpresa,
    loadCenario,
    reset,
  }
}
