import { Component, input, computed } from '@angular/core'

type AiBadgeVariant = 'default' | 'prominent' | 'subtle'

@Component({
  selector: 'mcpe-ai-badge',
  standalone: true,
  template: `
    <span [class]="classes()">
      @if (showIcon()) {
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 1-1.275-1.275L3 12l5.813-1.912a2 2 0 0 1 1.275-1.275L12 3z" />
        </svg>
      }
      <ng-content />
    </span>
  `,
})
export class SnxAiBadgeComponent {
  variant = input<AiBadgeVariant>('default')
  showIcon = input(true)
  class = input('')
  classes = computed(() =>
    ['mcpe-ai-badge', `mcpe-ai-badge-${this.variant()}`, this.class()].filter(Boolean).join(' ')
  )
}
