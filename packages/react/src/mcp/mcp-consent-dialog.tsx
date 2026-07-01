import { cn, parseScopes } from '@mcp-elements/core'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../dialog'
import { Button } from '../button'

export interface McpConsentDialogProps {
  open: boolean
  serverName: string
  serverIcon?: string
  scopes: string[]
  onApprove: () => void
  onDeny: () => void
  className?: string
}

export function McpConsentDialog({
  open,
  serverName,
  serverIcon,
  scopes,
  onApprove,
  onDeny,
  className,
}: McpConsentDialogProps) {
  const parsed = parseScopes(scopes.join(' '))

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onDeny() }}>
      <div className={cn('mcpe-mcp-consent-dialog', className)}>
        <DialogHeader>
          <DialogTitle>Permission Request</DialogTitle>
          <DialogDescription>
            Review and approve the permissions this server is requesting.
          </DialogDescription>
        </DialogHeader>

        {/* Server info */}
        <div className="mcpe-mcp-consent-dialog-server">
          <div className="mcpe-mcp-consent-dialog-icon" aria-hidden="true">
            {serverIcon ? (
              <img src={serverIcon} alt="" />
            ) : (
              serverName[0]?.toUpperCase() ?? '?'
            )}
          </div>
          <div className="mcpe-mcp-consent-dialog-server-text">
            <p className="mcpe-mcp-consent-dialog-server-name">{serverName}</p>
            <p className="mcpe-mcp-consent-dialog-server-meta">is requesting access to</p>
          </div>
        </div>

        {/* Scopes list */}
        <div
          className="mcpe-mcp-consent-dialog-scopes"
          role="list"
          aria-label="Requested permissions"
        >
          {parsed.map((s) => (
            <div key={s.raw} className="mcpe-mcp-consent-dialog-scope-item" role="listitem">
              <span className="mcpe-mcp-consent-dialog-scope-resource">{s.resource}</span>
              <div className="mcpe-mcp-consent-dialog-scope-perms">
                {s.permissions.map((p) => (
                  <span
                    key={p}
                    className="mcpe-mcp-consent-dialog-scope-perm"
                    data-perm={p.toLowerCase()}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mcpe-mcp-consent-dialog-actions">
          <Button variant="outline" onClick={onDeny}>
            Deny
          </Button>
          <Button variant="primary" onClick={onApprove}>
            Allow
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
