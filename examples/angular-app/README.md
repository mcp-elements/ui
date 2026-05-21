# snuxt-ui Angular Example

This directory contains example Angular component usage for snuxt-ui.

## Setup

To use snuxt-ui in an Angular project:

1. Create a new Angular project:
   ```bash
   ng new my-app
   cd my-app
   ```

2. Initialize snuxt-ui:
   ```bash
   npx snuxt-ui init
   ```

3. Add components:
   ```bash
   npx snuxt-ui add button card dialog
   ```

## Example Usage

### Button
```typescript
import { Component } from '@angular/core'
import { SnxButtonComponent } from './components/ui/button.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SnxButtonComponent],
  template: `
    <mcpe-button variant="primary" size="md">Click me</mcpe-button>
    <mcpe-button variant="outline">Outline</mcpe-button>
    <mcpe-button variant="destructive">Delete</mcpe-button>
  `,
})
export class AppComponent {}
```

### Card
```typescript
import { Component } from '@angular/core'
import {
  SnxCardComponent,
  SnxCardHeaderComponent,
  SnxCardTitleComponent,
  SnxCardDescriptionComponent,
  SnxCardContentComponent,
} from './components/ui/card.component'

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    SnxCardComponent,
    SnxCardHeaderComponent,
    SnxCardTitleComponent,
    SnxCardDescriptionComponent,
    SnxCardContentComponent,
  ],
  template: `
    <mcpe-card>
      <mcpe-card-header>
        <mcpe-card-title>Welcome</mcpe-card-title>
        <mcpe-card-description>Get started with snuxt-ui</mcpe-card-description>
      </mcpe-card-header>
      <mcpe-card-content>
        <p>Your content here</p>
      </mcpe-card-content>
    </mcpe-card>
  `,
})
export class ExampleComponent {}
```

### Dialog
```typescript
import { Component, viewChild } from '@angular/core'
import { SnxDialogComponent } from './components/ui/dialog.component'
import { SnxButtonComponent } from './components/ui/button.component'

@Component({
  selector: 'app-dialog-example',
  standalone: true,
  imports: [SnxDialogComponent, SnxButtonComponent],
  template: `
    <mcpe-button (click)="dialog.show()">Open Dialog</mcpe-button>
    <mcpe-dialog #dialog [modal]="true">
      <h2 class="mcpe-dialog-title">Confirm Action</h2>
      <p class="mcpe-dialog-description">Are you sure you want to proceed?</p>
      <div class="mcpe-dialog-footer">
        <mcpe-button variant="outline" (click)="dialog.close()">Cancel</mcpe-button>
        <mcpe-button variant="destructive" (click)="dialog.close()">Confirm</mcpe-button>
      </div>
    </mcpe-dialog>
  `,
})
export class DialogExampleComponent {
  dialog = viewChild<SnxDialogComponent>('dialog')
}
```

### Tabs
```typescript
import { Component } from '@angular/core'
import {
  SnxTabsComponent,
  SnxTabsListComponent,
  SnxTabsTriggerComponent,
  SnxTabsContentComponent,
} from './components/ui/tabs.component'

@Component({
  selector: 'app-tabs-example',
  standalone: true,
  imports: [SnxTabsComponent, SnxTabsListComponent, SnxTabsTriggerComponent, SnxTabsContentComponent],
  template: `
    <mcpe-tabs [items]="[{value: 'tab1'}, {value: 'tab2'}]" defaultValue="tab1" #tabs>
      <mcpe-tabs-list>
        <mcpe-tabs-trigger [isActive]="tabs.isActive('tab1')" (onClick)="tabs.select('tab1')">
          Tab 1
        </mcpe-tabs-trigger>
        <mcpe-tabs-trigger [isActive]="tabs.isActive('tab2')" (onClick)="tabs.select('tab2')">
          Tab 2
        </mcpe-tabs-trigger>
      </mcpe-tabs-list>
      <mcpe-tabs-content [isActive]="tabs.isActive('tab1')">
        Content for Tab 1
      </mcpe-tabs-content>
      <mcpe-tabs-content [isActive]="tabs.isActive('tab2')">
        Content for Tab 2
      </mcpe-tabs-content>
    </mcpe-tabs>
  `,
})
export class TabsExampleComponent {}
```

### Select
```typescript
import { Component } from '@angular/core'
import { SnxSelectComponent } from './components/ui/select.component'

@Component({
  selector: 'app-select-example',
  standalone: true,
  imports: [SnxSelectComponent],
  template: `
    <mcpe-select
      [options]="[
        { value: 'react', label: 'React' },
        { value: 'angular', label: 'Angular' },
        { value: 'vue', label: 'Vue', disabled: true },
      ]"
      placeholder="Choose framework..."
      (valueChange)="onSelect($event)"
    />
  `,
})
export class SelectExampleComponent {
  onSelect(value: string) {
    console.log('Selected:', value)
  }
}
```

### Tooltip
```typescript
import { Component } from '@angular/core'
import { SnxTooltipDirective } from './components/ui/tooltip.directive'
import { SnxButtonComponent } from './components/ui/button.component'

@Component({
  selector: 'app-tooltip-example',
  standalone: true,
  imports: [SnxTooltipDirective, SnxButtonComponent],
  template: `
    <mcpe-button [snxTooltip]="'Helpful information'" variant="outline">
      Hover me
    </mcpe-button>
  `,
})
export class TooltipExampleComponent {}
```

### Theme Switching
```typescript
// In your app component
toggleTheme(theme: 'light' | 'dark' | 'glass') {
  if (theme === 'light') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}
```
