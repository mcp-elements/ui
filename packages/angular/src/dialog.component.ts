import { Component, input, output, signal, computed, effect, ElementRef, viewChild } from '@angular/core'
import { createDialog } from '@mcp-elements/core'

@Component({
  selector: 'snx-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="snx-dialog-overlay" (click)="close()"></div>
      <div
        #content
        class="snx-dialog-content"
        role="dialog"
        [attr.aria-modal]="modal()"
        (keydown.escape)="close()"
      >
        <ng-content />
        <button class="snx-dialog-close" (click)="close()" aria-label="Close">&#x2715;</button>
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
