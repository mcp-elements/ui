import { Component, input, computed } from '@angular/core'

@Component({
  selector: 'mcpe-feedback',
  standalone: true,
  template: `<div class="mcpe-feedback"><ng-content /></div>`,
})
export class SnxFeedbackComponent {}

type FeedbackType = 'up' | 'down'

@Component({
  selector: 'mcpe-feedback-btn',
  standalone: true,
  template: `
    <button [class]="classes()" type="button">
      @if (feedbackType() === 'up') {
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
        </svg>
      }
    </button>
  `,
})
export class SnxFeedbackButtonComponent {
  feedbackType = input.required<FeedbackType>({ alias: 'type' })
  selected = input(false)
  class = input('')
  classes = computed(() =>
    [
      'mcpe-feedback-btn',
      `mcpe-feedback-btn-${this.feedbackType()}`,
      this.selected() ? 'mcpe-feedback-btn-selected' : '',
      this.class(),
    ].filter(Boolean).join(' ')
  )
}

@Component({
  selector: 'mcpe-feedback-separator',
  standalone: true,
  template: `<span class="mcpe-feedback-separator"></span>`,
})
export class SnxFeedbackSeparatorComponent {}

@Component({
  selector: 'mcpe-feedback-form',
  standalone: true,
  template: `<div class="mcpe-feedback-form"><ng-content /></div>`,
})
export class SnxFeedbackFormComponent {}

@Component({
  selector: 'mcpe-feedback-input',
  standalone: true,
  template: `<input class="mcpe-feedback-input" [placeholder]="placeholder()" />`,
})
export class SnxFeedbackInputComponent {
  placeholder = input('Add a comment...')
}

@Component({
  selector: 'mcpe-feedback-submit',
  standalone: true,
  template: `<button class="mcpe-feedback-submit" type="button"><ng-content /></button>`,
})
export class SnxFeedbackSubmitComponent {}
