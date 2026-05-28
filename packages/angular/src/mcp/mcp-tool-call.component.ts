import { Component, input, output, signal, effect, computed, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { cn } from '@mcp-elements/core'
import type { ToolStateApi, ToolStateSnapshot } from '@mcp-elements/core'

const STATUS_LABELS: Record<string, string> = {
  idle: 'idle',
  pending: 'pending',
  running: 'running',
  done: 'done',
  error: 'error',
  cancelled: 'cancelled',
}

@Component({
  selector: 'mcpe-mcp-tool-call',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="classes()">
      <!-- Header -->
      <div class="mcpe-mcp-tool-call-header">
        <div class="mcpe-mcp-tool-call-name">
          <span class="mcpe-mcp-tool-call-icon" aria-hidden="true">fn</span>
          <span class="mcpe-mcp-tool-call-title">{{ displayName() }}</span>
        </div>
        <span [class]="badgeClass()">
          @if (snap().status === 'running') {
            <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          }
          {{ statusLabels[snap().status] }}
        </span>
      </div>
      <!-- Args -->
      @if (displayArgs()) {
        <pre class="mcpe-mcp-tool-call-args">{{ displayArgs() | json }}</pre>
      }
      <!-- Progress bar -->
      @if (snap().status === 'running') {
        <div class="mcpe-mcp-tool-call-progress" role="progressbar" aria-label="Tool running">
          <div class="mcpe-mcp-tool-call-progress-bar" style="width: 60%"></div>
        </div>
      }
      <!-- Result -->
      @if (snap().status === 'done' && snap().result) {
        <div class="mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-done">
          @for (block of textBlocks(); track $index) {
            <p class="whitespace-pre-wrap text-sm">{{ block }}</p>
          }
        </div>
      }
      <!-- Error -->
      @if (snap().status === 'error' && snap().error) {
        <div class="mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-error">
          <p class="text-sm">{{ snap().error?.message }}</p>
          <button (click)="onRetry.emit()" class="text-xs underline underline-offset-2">Retry</button>
        </div>
      }
    </div>
  `,
})
export class McpeMcpToolCallComponent implements OnDestroy {
  state = input.required<ToolStateApi>()
  toolName = input<string>()
  args = input<Record<string, unknown>>()
  onRetry = output<void>()
  class = input('')

  readonly statusLabels = STATUS_LABELS

  snap = signal<ToolStateSnapshot>({ status: 'idle' })
  private _unsub: (() => void) | undefined

  constructor() {
    effect(() => {
      this._unsub?.()
      const s = this.state()
      this.snap.set({
        status: s.status,
        tool: s.tool,
        args: s.args,
        result: s.result,
        error: s.error,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
      })
      this._unsub = s.subscribe((snapshot: ToolStateSnapshot) => this.snap.set({ ...snapshot }))
    })
  }

  ngOnDestroy() { this._unsub?.() }

  classes = computed(() => cn('mcpe-mcp-tool-call', this.class()))
  badgeClass = computed(() => cn('mcpe-mcp-tool-call-badge', `mcpe-mcp-tool-call-badge-${this.snap().status}`))
  displayName = computed(() => this.snap().tool ?? this.toolName() ?? 'unknown')
  displayArgs = computed(() => this.snap().args ?? this.args())
  textBlocks = computed(() =>
    this.snap().result?.content
      .filter((c: { type: string }) => c.type === 'text')
      .map((c: { type: string; text?: string }) => (c as { type: 'text'; text: string }).text) ?? []
  )
}
