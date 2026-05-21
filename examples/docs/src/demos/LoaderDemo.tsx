import { Loader } from '@mcp-elements/react';

export function LoaderDemo() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Loader size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loader size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loader size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  );
}
