import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface SourceCardsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SourceCards = forwardRef<HTMLDivElement, SourceCardsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-source-cards', className)} {...props} />
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
      className={cn('mcpe-source-card', className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {favicon && <img className="mcpe-source-card-favicon" src={favicon} alt={domain} />}
      <div className="mcpe-source-card-body">
        <p className="mcpe-source-card-title">{title}</p>
        <p className="mcpe-source-card-domain">{domain}</p>
      </div>
      {index != null && <span className="mcpe-source-card-index">{index}</span>}
    </a>
  )
)
SourceCard.displayName = 'SourceCard'
