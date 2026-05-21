import { DropdownMenu, Button } from '@mcp-elements/react';

export function DropdownMenuDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu
        trigger={<Button variant="outline">Menu</Button>}
        items={[
          { id: 'edit', label: 'Edit', onSelect: () => {} },
          { id: 'copy', label: 'Copy', shortcut: '\u2318C', onSelect: () => {} },
          { id: 'sep1', type: 'separator', label: '' },
          { id: 'delete', label: 'Delete', onSelect: () => {} },
        ]}
      />
    </div>
  );
}
