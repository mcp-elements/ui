import { Component, input, computed, output, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'mcpe-input',
  standalone: true,
  template: `
    <input
      [class]="classes()"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SnxInputComponent),
      multi: true,
    },
  ],
})
export class SnxInputComponent implements ControlValueAccessor {
  type = input<string>('text')
  placeholder = input('')
  disabled = input(false)
  value = input('')
  class = input('')

  classes = computed(() => ['mcpe-input', this.class()].filter(Boolean).join(' '))

  private onChange: (value: string) => void = () => {}
  onTouched: () => void = () => {}

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }

  writeValue(value: string): void {}
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn }
  registerOnTouched(fn: () => void): void { this.onTouched = fn }
}
