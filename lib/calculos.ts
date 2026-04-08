import { Rendimentos, Creditos, Empresa, ResultadoCalculo } from './types'

/**
 * Tabela progressiva ANUAL 2026 — Lei 15.270/2025
 * Isento até R$ 88.200/ano (R$ 7.350/mês)
 * Faixas: 7,5% / 15% / 22,5% / 27,5%
 */
export function calcIRPFTabela2026(rTrib: number): number {
  if (rTrib <= 88200) return 0
  if (rTrib <= 120000) return rTrib * 0.075 - 6615
  if (rTrib <= 180000) return rTrib * 0.15 - 15915
  if (rTrib <= 240000) return rTrib * 0.225 - 29415
  return rTrib * 0.275 - 42615
}

/**
 * Alíquota mínima do IRPFM — art. 16-A Lei 9.250/1995
 * Fórmula: (base / 60.000) − 10, entre R$ 600k e R$ 1,2M
 * 10% fixo acima de R$ 1,2M
 */
export function calcAliquota(base: number): number {
  if (base >= 1_200_000) return 0.10
  if (base > 600_000) return Math.max(0, (base / 60_000 - 10) / 100)
  return 0
}

/**
 * Calcula a alíquota efetiva PF sobre dividendos (incremental)
 * Usada no cálculo do redutor art. 16-B
 */
function calcEfetivaPF(base: number, divTotal: number): number {
  if (divTotal <= 0) return 0
  const baseSemDiv = base - divTotal
  const brutoTotal = base * calcAliquota(base)
  const brutoSemDiv = baseSemDiv * calcAliquota(baseSemDiv)
  return (brutoTotal - brutoSemDiv) / divTotal
}

/**
 * Calcula o redutor individual de cada empresa — art. 16-B
 * Redutor = (efPJ + efPF − teto) × dividendos, se positivo
 */
export function calcRedutorEmpresa(empresa: Empresa, efPF: number): Empresa {
  const efPJ = empresa.lucro > 0 ? empresa.trib / empresa.lucro : 0
  const soma = efPJ + efPF
  const teto = empresa.teto / 100
  const redutor = soma > teto ? (soma - teto) * empresa.divpj : 0
  return { ...empresa, efPJ, efPF, redutor: Math.max(0, redutor) }
}

/**
 * Cálculo principal do IRPFM
 */
export function calcularIRPFM(
  rendimentos: Rendimentos,
  creditos: Creditos,
  empresas: Empresa[]
): ResultadoCalculo {
  const { rPJ, rPF, rDiv, rOff, rExcl, rGC, rOut, rIsen } = rendimentos

  // Base do IRPFM (isentos incentivados ficam de fora)
  const base = rPJ + rPF + rDiv + rOff + rExcl + rGC + rOut
  const rendaTotal = base + rIsen

  const aliq = calcAliquota(base)
  const irpfmBruto = base * aliq

  // IRPF tabela progressiva (auto se não informado)
  const rTrib = rPJ + rPF
  const irpfTabela = creditos.cDAA > 0
    ? creditos.cDAA
    : calcIRPFTabela2026(rTrib)

  const totalCreditos =
    irpfTabela +
    creditos.cDiv +
    creditos.cAplic +
    creditos.cOff +
    creditos.cOut

  // Alíquota efetiva PF sobre dividendos (para redutor)
  const divTotal = rDiv + rOff
  const efPF = calcEfetivaPF(base, divTotal)

  // Redutores por empresa
  const empresasCalc = empresas.map(e => calcRedutorEmpresa(e, efPF))
  const totalReductor = empresasCalc.reduce((s, e) => s + e.redutor, 0)

  const irpfmFinal = Math.max(0, irpfmBruto - totalCreditos - totalReductor)
  const cargaEfetiva = rendaTotal > 0
    ? (totalCreditos + irpfmFinal) / rendaTotal
    : 0

  const aliqZona =
    base <= 600_000 ? 'isento'
    : base < 1_200_000 ? 'progressiva'
    : 'maxima'

  return {
    base,
    rendaTotal,
    aliq,
    irpfmBruto,
    irpfTabela,
    totalCreditos,
    totalReductor,
    irpfmFinal,
    cargaEfetiva,
    efPF,
    estaNoIRPFM: base > 600_000,
    aliqZona,
  }
}

/**
 * Calcula IRRF mensal sobre dividendos — art. 6º-A
 * 10% sobre o total do mês quando > R$ 50.000 por fonte pagadora
 */
export function calcIRRFMensal(dividendosMensais: number): {
  irrf: number
  irrfAnual: number
} {
  const irrf = dividendosMensais > 50_000 ? dividendosMensais * 0.10 : 0
  return { irrf, irrfAnual: irrf * 12 }
}

// Formatadores
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatPct(value: number): string {
  return (value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + '%'
}

export function parseBRL(value: string): number {
  const clean = value.replace(/[^\d,]/g, '').replace(',', '.')
  return parseFloat(clean) || 0
}
