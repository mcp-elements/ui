import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-separator',
  standalone: true,
  template: `<div [class]="classes()" role="separator" [attr.aria-orientation]="orientation()"></div>`,
})
export class SnxSeparatorComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal')
  class = input('')

  classes = computed(() =>
    ['mcpe-separator', `mcpe-separator-${this.orientation()}`, this.class()].filter(Boolean).join(' ')
  )
}
