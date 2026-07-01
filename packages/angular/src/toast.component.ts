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
          <span class="mcpe-toast-icon" aria-hidden="true">
            @switch (t.variant) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
              }
              @case ('destructive') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              }
              @default {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              }
            }
          </span>
          <div class="mcpe-toast-body">
            @if (t.title) { <div class="mcpe-toast-title">{{ t.title }}</div> }
            @if (t.description) { <div class="mcpe-toast-description">{{ t.description }}</div> }
          </div>
          <button class="mcpe-toast-close" (click)="toastService.dismiss(t.id)" type="button" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
