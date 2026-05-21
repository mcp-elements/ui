import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface SourceCardsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SourceCards = forwardRef<HTMLDivElement, SourceCardsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-source-cards', className)} {...props} />
  )
)
SourceCards.displayName = 'SourceCards'

export interface SourceCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  favicon?: string
  title: string
  domain: string
  index?: number
}

export const SourceCard = forwardRef<HTMLAnchorElement, SourceCardProps>(
  ({ favicon, title, domain, index, className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn('snx-source-card', className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {favicon && <img className="snx-source-card-favicon" src={favicon} alt={domain} />}
      <div className="snx-source-card-body">
        <p className="snx-source-card-title">{title}</p>
        <p className="snx-source-card-domain">{domain}</p>
      </div>
      {index != null && <span className="snx-source-card-index">{index}</span>}
    </a>
  )
)
SourceCard.displayName = 'SourceCard'
