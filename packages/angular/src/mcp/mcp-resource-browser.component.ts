import { Component, input, output, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { cn } from '@mcp-elements/core'

export interface McpResource {
  uri: string
  name: string
  mimeType?: string
  description?: string
}

function mimeTypeLabel(mimeType?: string): string {
  if (!mimeType) return 'res'
  if (mimeType.includes('json')) return 'json'
  if (mimeType.includes('text')) return 'txt'
  if (mimeType.includes('image')) return 'img'
  if (mimeType.includes('pdf')) return 'pdf'
  return mimeType.split('/')[1]?.slice(0, 4) ?? 'res'
}

@Component({
  selector: 'mcpe-mcp-resource-browser',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div [class]="classes()">
        @for (n of skeletonItems; track n) {
          <div class="flex items-center gap-3 px-3 py-2.5">
            <div class="h-8 w-8 rounded-md animate-pulse bg-muted"></div>
            <div class="h-4 flex-1 rounded animate-pulse bg-muted"></div>
          </div>
        }
      </div>
    } @else if (resources().length === 0) {
      <div [class]="classes()">
        <p class="mcpe-mcp-resource-browser-empty">No resources available</p>
      </div>
    } @else {
      <div [class]="classes()" role="list">
        @for (r of resources(); track r.uri) {
          <button
            type="button"
            role="listitem"
            [class]="itemClass(r.uri)"
            [attr.aria-selected]="selectedUri() === r.uri"
            [attr.aria-label]="r.name"
            (click)="select(r)"
          >
            <span class="mcpe-mcp-resource-browser-icon" aria-hidden="true">{{ mimeLabel(r.mimeType) }}</span>
            <span class="mcpe-mcp-resource-browser-name">{{ r.name }}</span>
            @if (r.mimeType) {
              <span class="mcpe-mcp-resource-browser-type">{{ r.mimeType.split('/')[0] }}</span>
            }
          </button>
        }
      </div>
    }
  `,
})
export class McpeMcpResourceBrowserComponent {
  resources = input<McpResource[]>([])
  selectedUri = input<string>()
  loading = input(false)
  class = input('')
  onSelect = output<McpResource>()

  readonly skeletonItems = [1, 2, 3, 4]

  classes = computed(() => cn('mcpe-mcp-resource-browser', this.class()))

  itemClass(uri: string): string {
    return cn(
      'mcpe-mcp-resource-browser-item w-full text-left',
      this.selectedUri() === uri ? 'mcpe-mcp-resource-browser-item-selected' : ''
    )
  }

  mimeLabel(mimeType?: string): string {
    return mimeTypeLabel(mimeType)
  }

  select(r: McpResource) {
    this.onSelect.emit(r)
  }
}
