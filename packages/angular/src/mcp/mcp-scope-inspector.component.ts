import { Component, input, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { cn, parseScopes } from '@mcp-elements/core'
import type { ScopeDescriptor } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-mcp-scope-inspector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="classes()" role="list">
      @for (s of parsedScopes(); track s.raw) {
        <div class="mcpe-mcp-scope-inspector-item" role="listitem">
          <button
            type="button"
            class="mcpe-mcp-scope-inspector-trigger"
            [attr.aria-expanded]="isOpen(s.raw)"
            (click)="toggle(s.raw)"
          >
            <div class="flex items-center gap-3">
              <span class="mcpe-mcp-scope-inspector-resource">{{ s.resource }}</span>
              <div class="mcpe-mcp-scope-inspector-perms">
                @for (p of s.permissions; track p) {
                  <span class="mcpe-mcp-scope-inspector-perm" [attr.data-perm]="p.toLowerCase()">{{ p }}</span>
                }
              </div>
            </div>
            <svg
              [class]="chevronClass(s.raw)"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          @if (isOpen(s.raw) && getDescription(s)) {
            <div role="region" class="mcpe-mcp-scope-inspector-body">
              {{ getDescription(s) }}
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class McpeMcpScopeInspectorComponent {
  scopes = input<string | ScopeDescriptor[]>('')
  descriptions = input<Record<string, string>>({})
  class = input('')

  openKeys = signal<Set<string>>(new Set())

  parsedScopes = computed((): ScopeDescriptor[] => {
    const s = this.scopes()
    return typeof s === 'string' ? parseScopes(s) : s
  })

  classes = computed(() => cn('mcpe-mcp-scope-inspector', this.class()))

  toggle(key: string) {
    this.openKeys.update((prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  isOpen(key: string): boolean {
    return this.openKeys().has(key)
  }

  chevronClass(key: string): string {
    return cn('mcpe-mcp-scope-inspector-chevron', this.isOpen(key) ? 'mcpe-mcp-scope-inspector-chevron-open' : '')
  }

  getDescription(s: ScopeDescriptor): string | undefined {
    const d = this.descriptions()
    return d[s.raw] ?? d[s.resource] ?? s.description
  }
}
