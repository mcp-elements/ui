import { useState, useMemo, useCallback } from 'react'
import { createDropdownMenu, type DropdownMenuItem, type DropdownMenuConfig } from '@mcp-elements/core'

export function useDropdownMenu(items: DropdownMenuItem[], config: Omit<DropdownMenuConfig, 'onOpenChange'> = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const api = useMemo(
    () => createDropdownMenu(items, { ...config, onOpenChange: setIsOpen }),
    [items]
  )

  const { handleKeyDown: _coreHandleKeyDown, ...restApi } = api

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      api.handleKeyDown(e.nativeEvent, isOpen, highlightedIndex, setHighlightedIndex)
    },
    [api, isOpen, highlightedIndex]
  )

  return {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    ...restApi,
  }
}
