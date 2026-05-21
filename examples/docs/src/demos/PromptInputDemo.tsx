import { useState } from 'react'
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputActions,
  PromptInputCharCount,
  PromptInputAttachments,
  PromptInputAttachment,
  Button,
} from '@mcp-elements/react'

export function PromptInputDemo() {
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState(['report.pdf', 'data.csv'])

  return (
    <div className="w-full max-w-lg">
      <PromptInput>
        {attachments.length > 0 && (
          <PromptInputAttachments>
            {attachments.map((file) => (
              <PromptInputAttachment
                key={file}
                onRemove={() => setAttachments((a) => a.filter((f) => f !== file))}
              >
                {file}
              </PromptInputAttachment>
            ))}
          </PromptInputAttachments>
        )}
        <PromptInputTextarea
          placeholder="Ask me anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <PromptInputFooter>
          <PromptInputActions>
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
            </Button>
            <Button variant="primary" size="icon" disabled={!value.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
            </Button>
          </PromptInputActions>
          <PromptInputCharCount count={value.length} max={1000} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
