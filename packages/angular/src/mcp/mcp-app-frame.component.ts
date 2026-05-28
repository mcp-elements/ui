import { Component, input, output, effect, computed, ElementRef, viewChild, OnDestroy } from '@angular/core'
import { cn, createAppBridge } from '@mcp-elements/core'
import type { AppMessageEnvelope } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-mcp-app-frame',
  standalone: true,
  template: `
    <div [class]="classes()">
      <iframe
        #frame
        [src]="src()"
        [sandbox]="sandbox()"
        [style.height.px]="height()"
        title="MCP App"
        aria-label="MCP App frame"
        style="display:block;width:100%;border:none"
      ></iframe>
    </div>
  `,
})
export class McpeMcpAppFrameComponent implements OnDestroy {
  src = input.required<string>()
  height = input(480)
  sandbox = input('allow-scripts allow-same-origin')
  class = input('')
  onMessage = output<AppMessageEnvelope>()

  frame = viewChild<ElementRef<HTMLIFrameElement>>('frame')

  private _unsub: (() => void) | undefined
  private _removeListener: (() => void) | undefined

  constructor() {
    effect(() => {
      this._cleanup()
      const bridge = createAppBridge({
        postMessage: (env: AppMessageEnvelope) => {
          this.frame()?.nativeElement?.contentWindow?.postMessage(env, '*')
        },
      })
      const unsub = bridge.onMessage((env: AppMessageEnvelope) => this.onMessage.emit(env))
      const handler = (e: MessageEvent) => bridge.receive(e.data)
      window.addEventListener('message', handler)
      this._unsub = unsub
      this._removeListener = () => window.removeEventListener('message', handler)
    })
  }

  private _cleanup() {
    this._unsub?.()
    this._removeListener?.()
    this._unsub = undefined
    this._removeListener = undefined
  }

  ngOnDestroy() { this._cleanup() }

  classes = computed(() => cn('mcpe-mcp-app-frame', this.class()))
}
