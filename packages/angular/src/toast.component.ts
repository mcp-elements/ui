import { Component, Injectable, signal } from '@angular/core'

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

@Injectable({ providedIn: 'root' })
export class SnxToastService {
  toasts = signal<ToastData[]>([])
  private counter = 0

  show(toast: Omit<ToastData, 'id'>, duration = 5000): string {
    const id = `toast-${++this.counter}`
    this.toasts.update(t => [...t, { id, ...toast }])
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration)
    }
    return id
  }

  success(title: string, description?: string) {
    return this.show({ title, description, variant: 'success' })
  }

  error(title: string, description?: string) {
    return this.show({ title, description, variant: 'destructive' })
  }

  dismiss(id: string) {
    this.toasts.update(t => t.filter(x => x.id !== id))
  }
}

@Component({
  selector: 'mcpe-toaster',
  standalone: true,
  template: `
    <div class="mcpe-toaster mcpe-toaster-bottom-right">
      @for (t of toastService.toasts(); track t.id) {
        <div
          [class]="'mcpe-toast group' + (t.variant === 'destructive' ? ' mcpe-toast-destructive' : '') + (t.variant === 'success' ? ' mcpe-toast-success' : '')"
        >
          <div class="flex-1">
            @if (t.title) { <div class="mcpe-toast-title">{{ t.title }}</div> }
            @if (t.description) { <div class="mcpe-toast-description">{{ t.description }}</div> }
          </div>
          <button class="mcpe-toast-close" (click)="toastService.dismiss(t.id)" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class SnxToasterComponent {
  constructor(public toastService: SnxToastService) {}
}
