import { useState, useMemo } from 'react'
import { createDrawer, type DrawerConfig } from '@mcp-elements/core'

export function useDrawer(config: Omit<DrawerConfig, 'onOpenChange'> = {}) {
  const [open, setOpen] = useState(false)
  const api = useMemo(
    () => createDrawer({ ...config, onOpenChange: setOpen }),
    [config.side]
  )
  return { open, setOpen, ...api }
}
