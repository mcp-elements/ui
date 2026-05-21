import { Component, input, output, computed } from '@angular/core'

@Component({
  selector: 'mcpe-prompt-input',
  standalone: true,
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class SnxPromptInputComponent {
  class = input('')
  classes = computed(() => ['mcpe-prompt-input', this.class()].filter(Boolean).join(' '))
}

@Component({
  selector: 'mcpe-prompt-input-textarea',
  standalone: true,
  template: `<textarea class="mcpe-prompt-input-textarea" [placeholder]="placeholder()" [rows]="rows()"></textarea>`,
})
export class SnxPromptInputTextareaComponent {
  placeholder = input('')
  rows = input(3)
}

@Component({
  selector: 'mcpe-prompt-input-footer',
  standalone: true,
  template: `<div class="mcpe-prompt-input-footer"><ng-content /></div>`,
})
export class SnxPromptInputFooterComponent {}

@Component({
  selector: 'mcpe-prompt-input-actions',
  standalone: true,
  template: `<div class="mcpe-prompt-input-actions"><ng-content /></div>`,
})
export class SnxPromptInputActionsComponent {}

@Component({
  selector: 'mcpe-prompt-input-char-count',
  standalone: true,
  template: `<span class="mcpe-prompt-input-char-count">{{ count() }}@if (max()) { / {{ max() }} }</span>`,
})
export class SnxPromptInputCharCountComponent {
  count = input(0)
  max = input<number | undefined>(undefined)
}

@Component({
  selector: 'mcpe-prompt-input-attachments',
  standalone: true,
  template: `<div class="mcpe-prompt-input-attachments"><ng-content /></div>`,
})
export class SnxPromptInputAttachmentsComponent {}

@Component({
  selector: 'mcpe-prompt-input-attachment',
  standalone: true,
  template: `
    <span class="mcpe-prompt-input-attachment">
      <ng-content />
      <button type="button" class="mcpe-prompt-input-attachment-remove" (click)="remove.emit()" aria-label="Remove">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </span>
  `,
})
export class SnxPromptInputAttachmentComponent {
  remove = output()
}
