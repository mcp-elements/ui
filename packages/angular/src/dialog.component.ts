import { Component, input, output, signal, computed, effect, ElementRef, viewChild } from '@angular/core'
import { createDialog } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="mcpe-dialog-overlay" (click)="close()">
        <div
          #content
          class="mcpe-dialog-content"
          role="dialog"
          [attr.aria-modal]="modal()"
          (click)="$event.stopPropagation()"
          (keydown.escape)="close()"
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
