import { CenarioKey, Cenario } from './types'

export const CENARIOS: Record<CenarioKey, Cenario> = {
  medio: {
    label: 'Sócio — renda média',
    rendimentos: {
      rPJ: 120_000,
      rDiv: 400_000,
      rIsen: 50_000,
    },
    creditos: {},
  },
  alto: {
    label: 'Sócio — alta renda',
    rendimentos: {
      rPJ: 200_000,
      rDiv: 900_000,
      rExcl: 100_000,
      rIsen: 200_000,
    },
    creditos: {
      cDiv: 90_000,
      cAplic: 15_000,
    },
  },
  exec: {
    label: 'Executivo + dividendos',
    rendimentos: {
      rPJ: 480_000,
      rDiv: 300_000,
      rExcl: 80_000,
      rIsen: 120_000,
    },
    creditos: {
      cAplic: 12_000,
    },
  },
  inv: {
    label: 'Investidor — portfólio misto',
    rendimentos: {
      rPF: 60_000,
      rDiv: 400_000,
      rExcl: 250_000,
      rGC: 150_000,
      rIsen: 300_000,
    },
    creditos: {
      cAplic: 37_500,
      cOut: 22_500,
    },
  },
  off: {
    label: 'Offshore + dividendos',
    rendimentos: {
      rPJ: 150_000,
      rDiv: 300_000,
      rOff: 400_000,
      rExcl: 50_000,
      rIsen: 100_000,
    },
    creditos: {
      cAplic: 7_500,
      cOff: 60_000,
    },
  },
  puro: {
    label: 'Puro dividendos',
    rendimentos: {
      rDiv: 1_000_000,
    },
    creditos: {},
  },
}

export const CENARIO_KEYS = Object.keys(CENARIOS) as CenarioKey[]
