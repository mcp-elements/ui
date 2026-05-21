import { Button, useToast } from '@mcp-elements/react';

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: 'Success!', description: 'Action completed.' })
        }
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: 'Heads up!', description: 'Something happened.' })
        }
      >
        Another Toast
      </Button>
    </div>
  );
}
