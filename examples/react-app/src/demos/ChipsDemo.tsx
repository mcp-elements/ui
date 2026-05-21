import { useState } from 'react';
import { Chips, Chip } from '@mcp-elements/react';

const initial = [
  { id: 1, label: 'React', variant: 'default' as const },
  { id: 2, label: 'TypeScript', variant: 'primary' as const },
  { id: 3, label: 'Tailwind', variant: 'outline' as const },
  { id: 4, label: 'Remove me', variant: 'destructive' as const },
];

export function ChipsDemo() {
  const [chips, setChips] = useState(initial);

  return (
    <div className="flex flex-col gap-2">
      <Chips>
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            variant={chip.variant}
            onRemove={() => setChips((c) => c.filter((x) => x.id !== chip.id))}
          >
            {chip.label}
          </Chip>
        ))}
      </Chips>
      {chips.length < initial.length && (
        <button
          className="text-xs text-muted-foreground underline self-start"
          onClick={() => setChips(initial)}
        >
          Reset
        </button>
      )}
    </div>
  );
}
