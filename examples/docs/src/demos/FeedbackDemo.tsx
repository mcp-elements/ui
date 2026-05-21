import { useState } from 'react'
import {
  Feedback,
  FeedbackButton,
  FeedbackSeparator,
  FeedbackForm,
  FeedbackInput,
  FeedbackSubmit,
} from '@mcp-elements/react'

export function FeedbackDemo() {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Feedback>
        <FeedbackButton
          type="up"
          selected={selected === 'up'}
          onClick={() => setSelected(selected === 'up' ? null : 'up')}
        />
        <FeedbackButton
          type="down"
          selected={selected === 'down'}
          onClick={() => setSelected(selected === 'down' ? null : 'down')}
        />
      </Feedback>

      {selected === 'down' && (
        <FeedbackForm>
          <FeedbackInput placeholder="What could be improved?" />
          <FeedbackSubmit>Send</FeedbackSubmit>
        </FeedbackForm>
      )}
    </div>
  )
}
