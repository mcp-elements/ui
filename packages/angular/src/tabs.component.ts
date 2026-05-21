import { Component, input, output, signal, computed, contentChildren, ElementRef } from '@angular/core'
import { createTabs, type TabItem } from '@mcp-elements/core'

@Component({
  selector: 'snx-tabs',
  standalone: true,
  template: `<div><ng-content /></div>`,
})
export class SnxTabsComponent {
  items = input<TabItem[]>([])
  defaultValue = input<string>('')
  activeValue = signal('')

  private api = computed(() =>
    createTabs(this.items(), {
      defaultValue: this.defaultValue(),
      onValueChange: (v) => this.activeValue.set(v),
    })
  )

  constructor() {
    effect(() => {
      const def = this.defaultValue()
      const items = this.items()
      if (def) {
        this.activeValue.set(def)
      } else if (items.length > 0) {
        this.activeValue.set(items[0].value)
      }
    })
  }

  getTabProps(value: string) {
    return this.api().getTriggerProps(value, this.activeValue())
  }

  getPanelProps(value: string) {
    return this.api().getPanelProps(value, this.activeValue())
  }

  isActive(value: string): boolean {
    return this.activeValue() === value
  }

  select(value: string) {
    this.activeValue.set(value)
  }
}

@Component({
  selector: 'snx-tabs-list',
  standalone: true,
  template: `<div role="tablist" class="snx-tabs-list"><ng-content /></div>`,
})
export class SnxTabsListComponent {}

@Component({
  selector: 'snx-tabs-trigger',
  standalone: true,
  template: `
    <button
      role="tab"
      [class]="classes()"
      [attr.aria-selected]="isActive()"
      [attr.tabindex]="isActive() ? 0 : -1"
      (click)="onClick.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class SnxTabsTriggerComponent {
  isActive = input(false)
  onClick = output<void>()
  class = input('')

  classes = computed(() =>
    ['snx-tabs-trigger', this.isActive() ? 'snx-tabs-trigger-active' : '', this.class()]
      .filter(Boolean)
      .join(' ')
  )
}

@Component({
  selector: 'snx-tabs-content',
  standalone: true,
  template: `
    @if (isActive()) {
      <div role="tabpanel" class="snx-tabs-content"><ng-content /></div>
    }
  `,
})
export class SnxTabsContentComponent {
  isActive = input(false)
}
