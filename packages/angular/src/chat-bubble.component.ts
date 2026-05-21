import { Component, input, computed } from '@angular/core'

type ChatBubbleVariant = 'user' | 'ai'

@Component({
  selector: 'mcpe-chat-bubble',
  standalone: true,
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class SnxChatBubbleComponent {
  variant = input<ChatBubbleVariant>('ai')
  class = input('')
  classes = computed(() =>
    ['mcpe-chat-bubble', `mcpe-chat-bubble-${this.variant()}`, this.class()].filter(Boolean).join(' ')
  )
}

@Component({
  selector: 'mcpe-chat-bubble-avatar',
  standalone: true,
  template: `<img class="mcpe-chat-bubble-avatar" [src]="src()" [alt]="alt()" />`,
})
export class SnxChatBubbleAvatarComponent {
  src = input.required<string>()
  alt = input('')
}

@Component({
  selector: 'mcpe-chat-bubble-content',
  standalone: true,
  template: `<div class="mcpe-chat-bubble-content"><ng-content /></div>`,
})
export class SnxChatBubbleContentComponent {}

@Component({
  selector: 'mcpe-chat-bubble-timestamp',
  standalone: true,
  template: `<span class="mcpe-chat-bubble-timestamp"><ng-content /></span>`,
})
export class SnxChatBubbleTimestampComponent {}

@Component({
  selector: 'mcpe-chat-bubble-typing',
  standalone: true,
  template: `
    <div class="mcpe-chat-bubble-typing">
      <span class="mcpe-chat-bubble-typing-dot"></span>
      <span class="mcpe-chat-bubble-typing-dot"></span>
      <span class="mcpe-chat-bubble-typing-dot"></span>
    </div>
  `,
})
export class SnxChatBubbleTypingComponent {}
