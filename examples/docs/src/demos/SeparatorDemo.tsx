import { Separator } from '@mcp-elements/react'

export function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">snuxt-ui</h4>
        <p className="text-xs text-muted-foreground">
          A framework-agnostic component library.
        </p>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center gap-3 text-xs">
        <span>Docs</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Source</span>
        <Separator orientation="vertical" className="h-4" />
        <span>CLI</span>
      </div>
    </div>
  )
}
