import { SuggestionChips, SuggestionChip } from '@mcp-elements/react'

export function SuggestionChipsDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <SuggestionChips>
        <SuggestionChip variant="default">Tell me more</SuggestionChip>
        <SuggestionChip variant="default">Give an example</SuggestionChip>
        <SuggestionChip variant="default">How does this compare to...</SuggestionChip>
        <SuggestionChip variant="default">Summarize this</SuggestionChip>
      </SuggestionChips>
      <SuggestionChips>
        <SuggestionChip variant="primary">React patterns</SuggestionChip>
        <SuggestionChip variant="primary">Performance tips</SuggestionChip>
        <SuggestionChip variant="outline">Show code</SuggestionChip>
        <SuggestionChip variant="outline">Explain further</SuggestionChip>
      </SuggestionChips>
    </div>
  )
}
