import { Popover, Button, Input } from '@mcp-elements/react';

export function PopoverDemo() {
  return (
    <div className="flex items-center justify-center">
      <Popover
        trigger={<Button variant="outline">Open Popover</Button>}
      >
        <div className="flex flex-col gap-2 p-1">
          <p className="text-sm font-medium">Settings</p>
          <Input placeholder="Width" />
          <Input placeholder="Height" />
          <Button size="sm">Apply</Button>
        </div>
      </Popover>
    </div>
  );
}
