import { Component, input } from '@angular/core'

@Component({
  selector: 'mcpe-source-cards',
  standalone: true,
  template: `<div class="mcpe-source-cards"><ng-content /></div>`,
})
export class SnxSourceCardsComponent {}

@Component({
  selector: 'mcpe-source-card',
  standalone: true,
  template: `
    <a [href]="href()" class="mcpe-source-card" target="_blank" rel="noopener noreferrer">
      @if (favicon()) {
        <img class="mcpe-source-card-favicon" [src]="favicon()" [alt]="domain()" />
      }
      <div class="mcpe-source-card-body">
        <p class="mcpe-source-card-title">{{ title() }}</p>
        <p class="mcpe-source-card-domain">{{ domain() }}</p>
      </div>
      @if (index()) {
        <span class="mcpe-source-card-index">{{ index() }}</span>
      }
    </a>
  `,
})
export class SnxSourceCardComponent {
  href = input.required<string>()
  favicon = input('')
  title = input('')
  domain = input('')
  index = input<number | undefined>(undefined)
}
