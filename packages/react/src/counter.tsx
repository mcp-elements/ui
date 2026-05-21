import { cn } from '@mcp-elements/core'

export interface CounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export function Counter({ value, onChange, min = 0, max = 99, step = 1, disabled, className }: CounterProps) {
  const decrement = () => onChange(Math.max(min, value - step))
  const increment = () => onChange(Math.min(max, value + step))

  return (
    <div className={cn('snx-counter', className)}>
      <button
        type="button"
        className="snx-counter-button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        type="text"
        inputMode="numeric"
        className="snx-counter-input"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10)
          if (!isNaN(num)) onChange(Math.max(min, Math.min(max, num)))
        }}
        disabled={disabled}
        aria-label="Count"
      />
      <button
        type="button"
        className="snx-counter-button"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
      </button>
    </div>
  )
}
