import { useState, useMemo } from 'react'
import { createDialog, type DialogConfig } from '@mcp-elements/core'

export function useDialog(config: Omit<DialogConfig, 'onOpenChange'> = {}) {
  const [open, setOpen] = useState(false)

  const api = useMemo(
    () => createDialog({ ...config, onOpenChange: setOpen }),
    [config.modal]
  )

  return { open, setOpen, ...api }
}
