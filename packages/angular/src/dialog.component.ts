import { Component, input, output, signal, effect, ElementRef, viewChild } from '@angular/core'
import { trapFocus, lockScroll } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-dialog',
  standalone: true,
  host: { '(document:keydown)': 'onKeydown($event)' },
  template: `
    @if (open()) {
      <div class="mcpe-dialog-overlay" (click)="close()">
        <div
          #content
          class="mcpe-dialog-content"
          role="dialog"
          tabindex="-1"
          [attr.aria-modal]="modal()"
          (click)="$event.stopPropagation()"
        >
          <ng-content />
          <button class="mcpe-dialog-close" (click)="close()" type="button" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    }
  `,
})
export class SnxDialogComponent {
  modal = input(true)
  open = signal(false)
  openChange = output<boolean>()

  content = viewChild<ElementRef<HTMLElement>>('content')
  private previouslyFocused: HTMLElement | null = null
  private unlockScroll: (() => void) | null = null

  constructor() {
    effect(() => {
      if (this.open()) {
        this.previouslyFocused = document.activeElement as HTMLElement | null
        if (this.modal()) this.unlockScroll = lockScroll()
        // Focus the dialog once the view has rendered it.
        setTimeout(() => this.content()?.nativeElement.focus())
      } else {
        this.unlockScroll?.()
        this.unlockScroll = null
        this.previouslyFocused?.focus?.()
        this.previouslyFocused = null
      }
    })
  }

  onKeydown(e: KeyboardEvent) {
    if (!this.open()) return
    if (e.key === 'Escape') {
      this.close()
      return
    }
    if (e.key === 'Tab') {
      const el = this.content()?.nativeElement
      if (el) trapFocus(el, e)
    }
  }

  toggle() {
    this.open.update(v => !v)
    this.openChange.emit(this.open())
  }

  close() {
    this.open.set(false)
    this.openChange.emit(false)
  }

  show() {
    this.open.set(true)
    this.openChange.emit(true)
  }
}
