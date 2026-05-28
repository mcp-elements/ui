import { cn, parseScopes } from '@mcp-elements/core'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../dialog'
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
      <div className={cn(className)}>
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
              <img src={serverIcon} alt="" className="h-full w-full object-cover" />
            ) : (
              serverName[0]?.toUpperCase() ?? '?'
            )}
          </div>
          <div>
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
              <div className="flex-1 min-w-0">
                <p className="mcpe-mcp-consent-dialog-scope-resource">{s.resource}</p>
                <div className="mcpe-mcp-consent-dialog-scope-perms">
                  {s.permissions.map((p) => (
                    <span key={p} className="mcpe-mcp-consent-dialog-scope-perm">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <DialogFooter>
          <div className="mcpe-mcp-consent-dialog-actions">
            <Button variant="outline" onClick={onDeny} className="flex-1">
              Deny
            </Button>
            <Button variant="primary" onClick={onApprove} className="flex-1">
              Allow
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  )
}
