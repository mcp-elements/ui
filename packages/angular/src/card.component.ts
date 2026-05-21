import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-card',
  standalone: true,
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class SnxCardComponent {
  class = input('')
  classes = computed(() => ['mcpe-card', this.class()].filter(Boolean).join(' '))
}

@Component({
  selector: 'mcpe-card-header',
  standalone: true,
  template: `<div class="mcpe-card-header"><ng-content /></div>`,
})
export class SnxCardHeaderComponent {}

@Component({
  selector: 'mcpe-card-title',
  standalone: true,
  template: `<h3 class="mcpe-card-title"><ng-content /></h3>`,
})
export class SnxCardTitleComponent {}

@Component({
  selector: 'mcpe-card-description',
  standalone: true,
  template: `<p class="mcpe-card-description"><ng-content /></p>`,
})
export class SnxCardDescriptionComponent {}

@Component({
  selector: 'mcpe-card-content',
  standalone: true,
  template: `<div class="mcpe-card-content"><ng-content /></div>`,
})
export class SnxCardContentComponent {}

@Component({
  selector: 'mcpe-card-footer',
  standalone: true,
  template: `<div class="mcpe-card-footer"><ng-content /></div>`,
})
export class SnxCardFooterComponent {}
