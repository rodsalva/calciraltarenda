import { SimuladorIRPFM } from '@/components/simulator/SimuladorIRPFM'

export const metadata = {
  title: 'Simulador IRPFM — Lei nº 15.270/2025',
  description: 'Calcule o IRPF mínimo sobre altas rendas (IRPFM) com redutor antibitributação, conforme a Lei 15.270/2025. Ano-calendário 2026.',
}

export default function Home() {
  return <SimuladorIRPFM />
}
