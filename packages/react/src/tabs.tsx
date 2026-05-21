import { useRef, useEffect } from 'react'
import { cn } from '@mcp-elements/core'
import { useTabs } from './hooks/use-tabs'
import type { TabItem } from '@mcp-elements/core'

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  children: (api: ReturnType<typeof useTabs>) => React.ReactNode
  className?: string
}

export function Tabs({ items, defaultValue, children, className }: TabsProps) {
  const api = useTabs(items, { defaultValue })
  return <div className={className}>{children(api)}</div>
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cn('snx-tabs-list', className)} {...props} />
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

export function TabsTrigger({ isActive, className, ...props }: TabsTriggerProps) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.focus()
    }
  }, [isActive])

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={cn('snx-tabs-trigger', isActive && 'snx-tabs-trigger-active', className)}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tabpanel" className={cn('snx-tabs-content', className)} {...props} />
}

export { useTabs } from './hooks/use-tabs'
