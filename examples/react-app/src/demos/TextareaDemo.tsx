import { useState } from 'react'
import { Textarea } from '@mcp-elements/react'

export function TextareaDemo() {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <Textarea
        placeholder="Type your message here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />
      <p className="text-xs text-muted-foreground text-right">
        {value.length}/280 characters
      </p>
    </div>
  )
}
