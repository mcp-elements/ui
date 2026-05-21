import { Component, input, output, signal, computed, ElementRef, viewChild, HostListener } from '@angular/core'
import { createSelect, type SelectOption } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-select',
  standalone: true,
  template: `
    <div class="relative" #container>
      <button
        class="mcpe-select-trigger"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox"
        (click)="toggle()"
        (keydown)="onKeyDown($event)"
      >
        <span>{{ selectedLabel() || placeholder() }}</span>
        <svg class="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      @if (isOpen()) {
        <div class="mcpe-select-content absolute top-full mt-1 w-full">
          <div class="mcpe-select-viewport" role="listbox">
            @for (option of options(); track option.value; let i = $index) {
              <div
                role="option"
                [attr.aria-selected]="option.value === selectedValue()"
                [attr.aria-disabled]="option.disabled"
                [class]="getItemClasses(option, i)"
                (click)="selectOption(option)"
                (mouseenter)="highlightedIndex.set(i)"
              >
                {{ option.label }}
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class SnxSelectComponent {
  options = input<SelectOption[]>([])
  placeholder = input('Select...')
  valueChange = output<string>()

  isOpen = signal(false)
  selectedValue = signal<string | null>(null)
  highlightedIndex = signal(0)

  container = viewChild<ElementRef>('container')

  selectedLabel = computed(() => {
    const val = this.selectedValue()
    return this.options().find(o => o.value === val)?.label ?? ''
  })

  toggle() { this.isOpen.update(v => !v) }

  selectOption(option: SelectOption) {
    if (option.disabled) return
    this.selectedValue.set(option.value)
    this.valueChange.emit(option.value)
    this.isOpen.set(false)
  }

  getItemClasses(option: SelectOption, index: number): string {
    return [
      'mcpe-select-item',
      index === this.highlightedIndex() ? 'mcpe-select-item-active' : '',
      option.value === this.selectedValue() ? 'mcpe-select-item-selected' : '',
    ].filter(Boolean).join(' ')
  }

  onKeyDown(event: KeyboardEvent) {
    const opts = this.options().filter(o => !o.disabled)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!this.isOpen()) { this.isOpen.set(true); return }
      this.highlightedIndex.update(i => (i + 1) % opts.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.highlightedIndex.update(i => (i - 1 + opts.length) % opts.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (this.isOpen()) {
        const opt = opts[this.highlightedIndex()]
        if (opt) this.selectOption(opt)
      } else {
        this.isOpen.set(true)
      }
    } else if (event.key === 'Escape') {
      this.isOpen.set(false)
    }
  }

  onDocumentClick(event: MouseEvent) {
    const el = this.container()?.nativeElement
    if (el && !el.contains(event.target as Node)) {
      this.isOpen.set(false)
    }
  }
}
