import { ReactNode } from 'react'
import { InfoTooltip } from './InfoTooltip'

interface FieldGroupProps {
  label: string
  sub?: string
  tooltip?: string
  children: ReactNode
  id?: string
}

export function FieldGroup({ label, sub, tooltip, children, id }: FieldGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium text-gray-700 leading-tight">
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
      </label>
      {sub && <p className="text-[10px] text-gray-400 -mt-0.5">{sub}</p>}
      {children}
    </div>
  )
}
