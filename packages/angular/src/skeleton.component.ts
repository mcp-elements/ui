import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-skeleton',
  standalone: true,
  template: `<div [class]="classes()"></div>`,
})
export class SnxSkeletonComponent {
  class = input('')
  classes = computed(() => ['mcpe-skeleton', this.class()].filter(Boolean).join(' '))
}
