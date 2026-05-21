import { Component, input, computed } from '@angular/core'

type SuggestionChipVariant = 'default' | 'primary' | 'outline'

@Component({
  selector: 'mcpe-suggestion-chips',
  standalone: true,
  template: `<div class="mcpe-suggestion-chips"><ng-content /></div>`,
})
export class SnxSuggestionChipsComponent {}

@Component({
  selector: 'mcpe-suggestion-chip',
  standalone: true,
  template: `<button [class]="classes()" type="button"><ng-content /></button>`,
})
export class SnxSuggestionChipComponent {
  variant = input<SuggestionChipVariant>('default')
  class = input('')
  classes = computed(() =>
    ['mcpe-suggestion-chip', `mcpe-suggestion-chip-${this.variant()}`, this.class()].filter(Boolean).join(' ')
  )
}
