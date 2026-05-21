import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-textarea',
  standalone: true,
  template: `
    <textarea
      [class]="classes()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [rows]="rows()"
    ><ng-content /></textarea>
  `,
})
export class SnxTextareaComponent {
  placeholder = input('')
  disabled = input(false)
  rows = input(3)
  class = input('')

  classes = computed(() => ['mcpe-textarea', this.class()].filter(Boolean).join(' '))
}
