import { useState } from 'react';
import { Counter } from '@mcp-elements/react';

export function CounterDemo() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex items-center gap-3">
      <Counter value={count} onChange={setCount} min={0} max={10} />
      <span className="text-sm text-muted-foreground">
        Value: {count}
      </span>
    </div>
  );
}
