import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-alert',
  standalone: true,
  template: `<div [class]="classes()" role="alert"><ng-content /></div>`,
})
export class SnxAlertComponent {
  variant = input<'default' | 'destructive' | 'success' | 'warning'>('default')
  classes = computed(() => `mcpe-alert mcpe-alert-${this.variant()}`)
}

@Component({
  selector: 'mcpe-alert-title',
  standalone: true,
  template: `<h5 class="mcpe-alert-title"><ng-content /></h5>`,
})
export class SnxAlertTitleComponent {}

@Component({
  selector: 'mcpe-alert-description',
  standalone: true,
  template: `<div class="mcpe-alert-description"><ng-content /></div>`,
})
export class SnxAlertDescriptionComponent {}
