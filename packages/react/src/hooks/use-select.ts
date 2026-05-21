import { useState, useMemo, useCallback } from 'react'
import { createSelect, type SelectOption, type SelectConfig } from '@mcp-elements/core'

export function useSelect(options: SelectOption[], config: Omit<SelectConfig, 'onValueChange' | 'onOpenChange'> = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const api = useMemo(
    () => createSelect(options, {
      ...config,
      onValueChange: setSelectedValue,
      onOpenChange: setIsOpen,
    }),
    [options]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      api.handleKeyDown(e.nativeEvent, isOpen, highlightedIndex, setHighlightedIndex)
    },
    [api, isOpen, highlightedIndex]
  )

  const { handleKeyDown: _coreHandleKeyDown, ...restApi } = api

  return {
    isOpen,
    setIsOpen,
    selectedValue,
    setSelectedValue,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    ...restApi,
  }
}
