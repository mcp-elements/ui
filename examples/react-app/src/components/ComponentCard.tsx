import { Card, CardHeader, CardTitle, CardContent, Badge } from '@mcp-elements/react'

interface ComponentCardProps {
  name: string
  type: 'css-only' | 'interactive'
  children: React.ReactNode
}

export function ComponentCard({ name, type, children }: ComponentCardProps) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <Badge variant={type === 'interactive' ? 'default' : 'outline'} className="text-[10px] px-1.5 py-0">
            {type === 'interactive' ? 'interactive' : 'css-only'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[80px] flex items-center justify-center">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
