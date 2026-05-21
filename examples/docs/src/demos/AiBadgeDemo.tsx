import { AiBadge } from '@mcp-elements/react'

export function AiBadgeDemo() {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <AiBadge variant="default">AI Generated</AiBadge>
      <AiBadge variant="prominent">AI Generated</AiBadge>
      <AiBadge variant="subtle">AI Generated</AiBadge>
      <AiBadge variant="default" showIcon={false}>No Icon</AiBadge>
    </div>
  )
}
