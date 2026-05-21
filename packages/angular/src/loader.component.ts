import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-loader',
  standalone: true,
  template: `<div [class]="classes()" role="status" aria-label="Loading"><span class="sr-only">Loading...</span></div>`,
})
export class SnxLoaderComponent {
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md')
  variant = input<'primary' | 'muted'>('primary')
  classes = computed(() => `mcpe-loader mcpe-loader-${this.size()} mcpe-loader-${this.variant()}`)
}
