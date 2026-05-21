import { Component, input, computed, signal } from '@angular/core'

@Component({
  selector: 'mcpe-avatar',
  standalone: true,
  template: `
    <div [class]="classes()">
      @if (src() && !hasError()) {
        <img [src]="src()" [alt]="alt()" class="mcpe-avatar-image" (error)="hasError.set(true)" />
      } @else {
        <span class="mcpe-avatar-fallback">{{ fallback() }}</span>
      }
    </div>
  `,
})
export class SnxAvatarComponent {
  src = input<string>('')
  alt = input('')
  fallback = input('')
  class = input('')
  hasError = signal(false)

  classes = computed(() => ['mcpe-avatar', this.class()].filter(Boolean).join(' '))
}
