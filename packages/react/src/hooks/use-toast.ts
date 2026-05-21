import { useState, useEffect, useCallback } from 'react'
import { toast as toastManager, type Toast } from '@mcp-elements/core'

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastManager.subscribe((state) => {
      setToasts([...state.toasts])
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    toastManager.dismiss(id)
  }, [])

  return { toasts, dismiss, toast: toastManager }
}
