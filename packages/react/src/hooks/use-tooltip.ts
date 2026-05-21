import { useState, useMemo, useEffect } from 'react'
import { createTooltip, type TooltipConfig } from '@mcp-elements/core'

export function useTooltip(config: Omit<TooltipConfig, 'onOpenChange'> = {}) {
  const [open, setOpen] = useState(false)

  const api = useMemo(
    () => createTooltip({ ...config, onOpenChange: setOpen }),
    [config.delay]
  )

  useEffect(() => {
    return () => api.destroy()
  }, [api])

  return { open, setOpen, ...api }
}
