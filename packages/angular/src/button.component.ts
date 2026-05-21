import { Component, computed, input } from '@angular/core'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

@Component({
  selector: 'mcpe-button',
  standalone: true,
  template: `
    <button [class]="classes()" [disabled]="disabled()" [type]="type()">
      <ng-content />
    </button>
  `,
})
export class SnxButtonComponent {
  variant = input<ButtonVariant>('primary')
  size = input<ButtonSize>('md')
  disabled = input(false)
  type = input<'button' | 'submit' | 'reset'>('button')
  class = input('')

  classes = computed(() =>
    ['mcpe-btn', `mcpe-btn-${this.variant()}`, `mcpe-btn-${this.size()}`, this.class()]
      .filter(Boolean)
      .join(' ')
  )
}
