import { Select } from '@mcp-elements/react'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]

export function SelectDemo() {
  return (
    <div className="w-full max-w-sm">
      <Select options={options} placeholder="Select a framework..." />
    </div>
  )
}
