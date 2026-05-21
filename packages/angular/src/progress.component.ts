import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-progress',
  standalone: true,
  template: `
    <div class="mcpe-progress" role="progressbar"
         [attr.aria-valuenow]="value()" [attr.aria-valuemin]="0" [attr.aria-valuemax]="max()">
      <div class="mcpe-progress-indicator" [style.transform]="transform()"></div>
    </div>
  `,
})
export class SnxProgressComponent {
  value = input(0)
  max = input(100)
  transform = computed(() => {
    const pct = Math.min(Math.max((this.value() / this.max()) * 100, 0), 100)
    return `translateX(-${100 - pct}%)`
  })
}
