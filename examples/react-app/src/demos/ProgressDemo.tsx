import { useState, useEffect } from 'react';
import { Progress, Button } from '@mcp-elements/react';

export function ProgressDemo() {
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    if (progress < 0) setProgress(0);
    if (progress > 100) setProgress(100);
  }, [progress]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <Progress value={progress} />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
          -10
        </Button>
        <span className="text-sm tabular-nums">{progress}%</span>
        <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
          +10
        </Button>
      </div>
    </div>
  );
}
