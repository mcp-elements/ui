import { cn } from '@mcp-elements/core'
import { Skeleton } from '../skeleton'

export interface McpResource {
  uri: string
  name: string
  mimeType?: string
  description?: string
}

export interface McpResourceBrowserProps {
  resources: McpResource[]
  selectedUri?: string
  onSelect?: (resource: McpResource) => void
  loading?: boolean
  className?: string
}

function mimeTypeLabel(mimeType?: string): string {
  if (!mimeType) return 'res'
  if (mimeType.includes('json')) return 'json'
  if (mimeType.includes('text')) return 'txt'
  if (mimeType.includes('image')) return 'img'
  if (mimeType.includes('pdf')) return 'pdf'
  return mimeType.split('/')[1]?.slice(0, 4) ?? 'res'
}

export function McpResourceBrowser({
  resources,
  selectedUri,
  onSelect,
  loading = false,
  className,
}: McpResourceBrowserProps) {
  if (loading) {
    return (
      <div className={cn('mcpe-mcp-resource-browser', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className={cn('mcpe-mcp-resource-browser', className)}>
        <p className="mcpe-mcp-resource-browser-empty">No resources available</p>
      </div>
    )
  }

  return (
    <div className={cn('mcpe-mcp-resource-browser', className)} role="list">
      {resources.map((r) => (
        <button
          key={r.uri}
          type="button"
          role="listitem"
          className={cn(
            'mcpe-mcp-resource-browser-item w-full text-left',
            selectedUri === r.uri && 'mcpe-mcp-resource-browser-item-selected',
          )}
          onClick={() => onSelect?.(r)}
          aria-selected={selectedUri === r.uri}
          aria-label={r.name}
        >
          <span className="mcpe-mcp-resource-browser-icon" aria-hidden="true">
            {mimeTypeLabel(r.mimeType)}
          </span>
          <span className="mcpe-mcp-resource-browser-name">{r.name}</span>
          {r.mimeType && (
            <span className="mcpe-mcp-resource-browser-type">{r.mimeType.split('/')[0]}</span>
          )}
        </button>
      ))}
    </div>
  )
}
