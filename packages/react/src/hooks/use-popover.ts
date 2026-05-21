import { useState, useMemo } from 'react'
import { createPopover, type PopoverConfig } from '@mcp-elements/core'

export function usePopover(config: Omit<PopoverConfig, 'onOpenChange'> = {}) {
  const [open, setOpen] = useState(false)

  const api = useMemo(
    () => createPopover({ ...config, onOpenChange: setOpen }),
    []
  )

  return { open, setOpen, ...api }
}
