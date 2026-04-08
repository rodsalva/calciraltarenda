export interface Rendimentos {
  rPJ: number        // tributáveis PJ (salário, pró-labore)
  rPF: number        // tributáveis PF/exterior (aluguéis, autônomo)
  rDiv: number       // lucros e dividendos
  rOff: number       // offshore Lei 14.754/2023
  rExcl: number      // tributação exclusiva/definitiva (CDB, fundos, JCP)
  rGC: number        // ganhos de capital bolsa/balcão
  rOut: number       // outros rendimentos na base
  rIsen: number      // isentos incentivados (LCI/LCA/FII etc.) — FORA da base
}

export interface Creditos {
  cDAA: number       // IRPF tabela progressiva DAA (0 = auto-estimado)
  cDiv: number       // IRRF dividendos 10% (art. 6º-A)
  cAplic: number     // IRRF aplicações/exclusiva na fonte
  cOff: number       // IRRF offshore Lei 14.754/2023
  cOut: number       // outros créditos compensáveis
}

export interface Empresa {
  id: string
  nome: string
  teto: 34 | 40 | 45  // alíquota nominal IRPJ+CSLL
  lucro: number        // lucro contábil antes IRPJ/CSLL
  trib: number         // IRPJ + CSLL pagos no ano
  divpj: number        // dividendos recebidos dessa PJ em 2026
  // calculados
  efPJ: number         // alíquota efetiva da PJ
  efPF: number         // alíquota efetiva PF (marginal sobre dividendos)
  redutor: number      // redutor individual
}

export interface ResultadoCalculo {
  base: number             // base do IRPFM
  rendaTotal: number       // base + isentos incentivados
  aliq: number             // alíquota mínima (0–0.10)
  irpfmBruto: number       // base × alíquota
  irpfTabela: number       // IRPF tabela progressiva (auto ou manual)
  totalCreditos: number    // soma de todos os créditos
  totalReductor: number    // soma dos redutores das empresas
  irpfmFinal: number       // max(0, bruto − créditos − redutor)
  cargaEfetiva: number     // (créditos + irpfmFinal) / rendaTotal
  efPF: number             // alíquota efetiva PF sobre dividendos
  estaNoIRPFM: boolean     // base > 600k
  aliqZona: 'isento' | 'progressiva' | 'maxima'
}

export interface SimuladorState {
  rendimentos: Rendimentos
  creditos: Creditos
  empresas: Empresa[]
  resultado: ResultadoCalculo
}

export type CenarioKey = 'medio' | 'alto' | 'exec' | 'inv' | 'off' | 'puro'

export interface Cenario {
  label: string
  rendimentos: Partial<Rendimentos>
  creditos: Partial<Creditos>
}
