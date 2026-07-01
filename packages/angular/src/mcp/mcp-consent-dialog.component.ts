import { Component, input, output, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { parseScopes } from '@mcp-elements/core'

@Component({
  selector: 'mcpe-mcp-consent-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open()) {
      <div class="mcpe-dialog-overlay" (click)="deny()">
        <div class="mcpe-dialog-content" role="dialog" aria-modal="true" [attr.aria-label]="'Allow ' + serverName() + '?'" (click)="$event.stopPropagation()">
          <div class="mcpe-mcp-consent-dialog">
            <div class="mcpe-dialog-header">
              <h2 class="mcpe-dialog-title">Permission Request</h2>
              <p class="mcpe-dialog-description">Review and approve the permissions this server is requesting.</p>
            </div>
            <!-- Server info -->
            <div class="mcpe-mcp-consent-dialog-server">
              <div class="mcpe-mcp-consent-dialog-icon" aria-hidden="true">
                @if (serverIcon()) {
                  <img [src]="serverIcon()" alt="" />
                } @else {
                  {{ serverName()[0]?.toUpperCase() ?? '?' }}
                }
              </div>
              <div class="mcpe-mcp-consent-dialog-server-text">
                <p class="mcpe-mcp-consent-dialog-server-name">{{ serverName() }}</p>
                <p class="mcpe-mcp-consent-dialog-server-meta">is requesting access to</p>
              </div>
            </div>
            <!-- Scopes -->
            <div class="mcpe-mcp-consent-dialog-scopes" role="list" aria-label="Requested permissions">
              @for (s of parsedScopes(); track s.raw) {
                <div class="mcpe-mcp-consent-dialog-scope-item" role="listitem">
                  <span class="mcpe-mcp-consent-dialog-scope-resource">{{ s.resource }}</span>
                  <div class="mcpe-mcp-consent-dialog-scope-perms">
                    @for (p of s.permissions; track p) {
                      <span class="mcpe-mcp-consent-dialog-scope-perm" [attr.data-perm]="p.toLowerCase()">{{ p }}</span>
                    }
                  </div>
                </div>
              }
            </div>
            <!-- Actions -->
            <div class="mcpe-mcp-consent-dialog-actions">
              <button class="mcpe-btn mcpe-btn-outline" (click)="deny()">Deny</button>
              <button class="mcpe-btn mcpe-btn-primary" (click)="approve()">Allow</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class McpeMcpConsentDialogComponent {
  open = input.required<boolean>()
  serverName = input.required<string>()
  serverIcon = input<string>()
  scopes = input<string[]>([])
  onApprove = output<void>()
  onDeny = output<void>()

  parsedScopes = computed(() => parseScopes(this.scopes().join(' ')))

  approve() { this.onApprove.emit() }
  deny() { this.onDeny.emit() }
}
