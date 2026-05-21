import { Component, input, signal, ElementRef, viewChild } from '@angular/core'

export interface DropdownItem {
  id: string
  label: string
  disabled?: boolean
  type?: 'item' | 'separator' | 'label'
  shortcut?: string
}

@Component({
  selector: 'mcpe-dropdown-menu',
  standalone: true,
  template: `
    <div class="relative inline-block" #container>
      <div (click)="toggle()">
        <ng-content select="[trigger]" />
      </div>
      @if (isOpen()) {
        <div class="mcpe-dropdown-menu-content absolute top-full mt-1 right-0" role="menu">
          @for (item of items(); track item.id) {
            @if (item.type === 'separator') {
              <div class="mcpe-dropdown-menu-separator" role="separator"></div>
            } @else if (item.type === 'label') {
              <div class="mcpe-dropdown-menu-label">{{ item.label }}</div>
            } @else {
              <div
                role="menuitem"
                [class]="'mcpe-dropdown-menu-item' + (item.disabled ? ' opacity-50 pointer-events-none' : '')"
                (click)="selectItem(item)"
                [attr.aria-disabled]="item.disabled"
              >
                <span class="flex-1">{{ item.label }}</span>
                @if (item.shortcut) {
                  <span class="mcpe-dropdown-menu-shortcut">{{ item.shortcut }}</span>
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class SnxDropdownMenuComponent {
  items = input<DropdownItem[]>([])
  isOpen = signal(false)
  container = viewChild<ElementRef>('container')

  toggle() { this.isOpen.update(v => !v) }
  close() { this.isOpen.set(false) }

  selectItem(item: DropdownItem) {
    if (!item.disabled) this.isOpen.set(false)
  }

  onDocumentClick(event: MouseEvent) {
    const el = this.container()?.nativeElement
    if (el && !el.contains(event.target as Node)) this.isOpen.set(false)
  }
}
