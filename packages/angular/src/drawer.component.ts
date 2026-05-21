import { Component, input, output, signal } from '@angular/core'

@Component({
  selector: 'mcpe-drawer',
  standalone: true,
  template: `
    @if (open()) {
      <div class="mcpe-drawer-overlay" (click)="close()"></div>
      <div
        [class]="'mcpe-drawer-content mcpe-drawer-content-' + side()"
        role="dialog"
        aria-modal="true"
        (keydown.escape)="close()"
      >
        <ng-content />
        <button class="mcpe-drawer-close" (click)="close()" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    }
  `,
})
export class SnxDrawerComponent {
  side = input<'left' | 'right' | 'top' | 'bottom'>('right')
  open = signal(false)
  openChange = output<boolean>()

  show() { this.open.set(true); this.openChange.emit(true) }
  close() { this.open.set(false); this.openChange.emit(false) }
  toggle() { this.open.update(v => !v); this.openChange.emit(this.open()) }
}

@Component({ selector: 'mcpe-drawer-header', standalone: true, template: `<div class="mcpe-drawer-header"><ng-content /></div>` })
export class SnxDrawerHeaderComponent {}

@Component({ selector: 'mcpe-drawer-footer', standalone: true, template: `<div class="mcpe-drawer-footer"><ng-content /></div>` })
export class SnxDrawerFooterComponent {}

@Component({ selector: 'mcpe-drawer-title', standalone: true, template: `<h2 class="mcpe-drawer-title"><ng-content /></h2>` })
export class SnxDrawerTitleComponent {}

@Component({ selector: 'mcpe-drawer-description', standalone: true, template: `<p class="mcpe-drawer-description"><ng-content /></p>` })
export class SnxDrawerDescriptionComponent {}

@Component({ selector: 'mcpe-drawer-body', standalone: true, template: `<div class="mcpe-drawer-body"><ng-content /></div>` })
export class SnxDrawerBodyComponent {}
