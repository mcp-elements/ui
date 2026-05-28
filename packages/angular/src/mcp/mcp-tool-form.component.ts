import { Component, input, output, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { cn, schemaToFields } from '@mcp-elements/core'
import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-mcp-tool-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <form [class]="classes()" (ngSubmit)="handleSubmit()">
      @if (fields().length === 0) {
        <p class="text-sm text-muted-foreground">This tool takes no inputs.</p>
      }
      @for (field of fields(); track field.key) {
        <div class="mcpe-mcp-tool-form-field">
          <label
            [for]="field.key"
            [class]="labelClass(field)"
          >{{ field.label }}</label>
          @switch (field.kind) {
            @case ('switch') {
              <input type="checkbox" [id]="field.key" class="mcpe-switch"
                [checked]="getBool(field.key)"
                (change)="onCheckChange(field.key, $event)" />
            }
            @case ('select') {
              <select [id]="field.key" class="mcpe-select"
                [value]="getStr(field.key)"
                (change)="onInputChange(field.key, $event)">
                <option value="">Select…</option>
                @for (opt of field.options ?? []; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            }
            @case ('textarea') {
              <textarea [id]="field.key" class="mcpe-textarea" rows="4"
                [value]="getStr(field.key)"
                (input)="onInputChange(field.key, $event)"></textarea>
            }
            @case ('number') {
              <input type="number" [id]="field.key" class="mcpe-input"
                [value]="getStr(field.key)"
                (input)="onNumberChange(field.key, $event)" />
            }
            @default {
              <input [type]="inputType(field)" [id]="field.key" class="mcpe-input"
                [value]="getStr(field.key)"
                (input)="onInputChange(field.key, $event)" />
            }
          }
          @if (field.help) {
            <p class="mcpe-mcp-tool-form-help">{{ field.help }}</p>
          }
        </div>
      }
      <div class="mcpe-mcp-tool-form-submit">
        <button type="submit" class="mcpe-btn mcpe-btn-primary mcpe-btn-sm" [disabled]="loading()">
          {{ loading() ? 'Running…' : submitLabel() }}
        </button>
      </div>
    </form>
  `,
})
export class McpeMcpToolFormComponent implements OnInit {
  schema = input.required<JsonSchema>()
  loading = input(false)
  submitLabel = input('Run')
  class = input('')
  onSubmit = output<Record<string, unknown>>()

  fields = computed(() => schemaToFields(this.schema()))
  values = signal<Record<string, unknown>>({})

  ngOnInit() {
    const defaults: Record<string, unknown> = {}
    for (const f of this.fields()) {
      if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue
    }
    this.values.set(defaults)
  }

  classes = computed(() => cn('mcpe-mcp-tool-form', this.class()))

  setValue(key: string, value: unknown) {
    this.values.update((v: Record<string, unknown>) => ({ ...v, [key]: value }))
  }

  onInputChange(key: string, event: Event) {
    this.setValue(key, (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value)
  }

  onNumberChange(key: string, event: Event) {
    this.setValue(key, (event.target as HTMLInputElement).valueAsNumber)
  }

  onCheckChange(key: string, event: Event) {
    this.setValue(key, (event.target as HTMLInputElement).checked)
  }

  getStr(key: string): string {
    const v = this.values()[key]
    return v == null ? '' : String(v)
  }

  getBool(key: string): boolean {
    return Boolean(this.values()[key])
  }

  labelClass(field: FieldDescriptor): string {
    return cn('mcpe-mcp-tool-form-label', field.required ? 'mcpe-mcp-tool-form-label-required' : '')
  }

  inputType(field: FieldDescriptor): string {
    switch (field.kind) {
      case 'email': return 'email'
      case 'url': return 'url'
      case 'date': return 'date'
      default: return 'text'
    }
  }

  handleSubmit() {
    this.onSubmit.emit(this.values())
  }
}
