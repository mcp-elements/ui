import { Component, computed, input } from '@angular/core'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

@Component({
  selector: 'mcpe-badge',
  standalone: true,
  template: `<span [class]="classes()"><ng-content /></span>`,
})
export class SnxBadgeComponent {
  variant = input<BadgeVariant>('default')
  class = input('')

  classes = computed(() =>
    ['mcpe-badge', `mcpe-badge-${this.variant()}`, this.class()].filter(Boolean).join(' ')
  )
}
