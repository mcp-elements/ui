import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  name?: string
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled, className, id, name }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={cn('mcpe-switch', className)}
      onClick={() => onCheckedChange?.(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onCheckedChange?.(!checked)
        }
      }}
    >
      <span className="mcpe-switch-thumb" />
      {name && <input type="hidden" name={name} value={checked ? 'on' : 'off'} />}
    </button>
  )
)
Switch.displayName = 'Switch'
