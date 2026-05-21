import { Component, input, output, signal } from '@angular/core'

@Component({
  selector: 'mcpe-counter',
  standalone: true,
  template: `
    <div class="mcpe-counter">
      <button type="button" class="mcpe-counter-button" (click)="decrement()"
              [disabled]="disabled() || value() <= min()" aria-label="Decrease">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      <input type="text" inputmode="numeric" class="mcpe-counter-input"
             [value]="value()" (change)="onInput($event)" [disabled]="disabled()" aria-label="Count" />
      <button type="button" class="mcpe-counter-button" (click)="increment()"
              [disabled]="disabled() || value() >= max()" aria-label="Increase">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
      </button>
    </div>
  `,
})
export class SnxCounterComponent {
  value = signal(0)
  min = input(0)
  max = input(99)
  step = input(1)
  disabled = input(false)
  valueChange = output<number>()

  decrement() {
    this.value.update(v => Math.max(this.min(), v - this.step()))
    this.valueChange.emit(this.value())
  }
  increment() {
    this.value.update(v => Math.min(this.max(), v + this.step()))
    this.valueChange.emit(this.value())
  }
  onInput(event: Event) {
    const num = parseInt((event.target as HTMLInputElement).value, 10)
    if (!isNaN(num)) {
      this.value.set(Math.max(this.min(), Math.min(this.max(), num)))
      this.valueChange.emit(this.value())
    }
  }
}
