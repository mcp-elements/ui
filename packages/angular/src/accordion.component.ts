import { Component, input, output, signal, computed } from '@angular/core'
import { createAccordion, type AccordionItemConfig } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-accordion',
  standalone: true,
  template: `<div><ng-content /></div>`,
})
export class SnxAccordionComponent {
  items = input<AccordionItemConfig[]>([])
  type = input<'single' | 'multiple'>('single')
  collapsible = input(false)
  expandedValues = signal<string[]>([])

  private api = computed(() =>
    createAccordion(this.items(), {
      type: this.type(),
      collapsible: this.collapsible(),
      onValueChange: (v) => this.expandedValues.set(v),
    })
  )

  isExpanded(value: string): boolean {
    return this.expandedValues().includes(value)
  }

  toggle(value: string) {
    const props = this.api().getTriggerProps(value, this.expandedValues())
    props.onClick()
  }
}

@Component({
  selector: 'mcpe-accordion-item',
  standalone: true,
  template: `<div class="mcpe-accordion-item"><ng-content /></div>`,
})
export class SnxAccordionItemComponent {}

@Component({
  selector: 'mcpe-accordion-trigger',
  standalone: true,
  template: `
    <h3>
      <button
        [class]="'mcpe-accordion-trigger'"
        [attr.aria-expanded]="isExpanded()"
        (click)="onClick.emit()"
      >
        <ng-content />
        <svg class="mcpe-accordion-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h3>
  `,
})
export class SnxAccordionTriggerComponent {
  isExpanded = input(false)
  onClick = output<void>()
}

@Component({
  selector: 'mcpe-accordion-content',
  standalone: true,
  template: `
    @if (isExpanded()) {
      <div role="region" class="mcpe-accordion-content"><ng-content /></div>
    }
  `,
})
export class SnxAccordionContentComponent {
  isExpanded = input(false)
}
