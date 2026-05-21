import { Component, input, signal, ElementRef, viewChild } from '@angular/core'

@Component({
  selector: 'mcpe-popover',
  standalone: true,
  template: `
    <div class="relative inline-block" #container>
      <div (click)="toggle()">
        <ng-content select="[trigger]" />
      </div>
      @if (isOpen()) {
        <div
          class="mcpe-popover-content absolute top-full mt-2"
          role="dialog"
          (keydown.escape)="close()"
        >
          <ng-content />
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class SnxPopoverComponent {
  isOpen = signal(false)
  container = viewChild<ElementRef>('container')

  toggle() { this.isOpen.update(v => !v) }
  close() { this.isOpen.set(false) }
  show() { this.isOpen.set(true) }

  onDocumentClick(event: MouseEvent) {
    const el = this.container()?.nativeElement
    if (el && !el.contains(event.target as Node)) {
      this.isOpen.set(false)
    }
  }
}
