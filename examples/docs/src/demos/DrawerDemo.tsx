import { useState } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
} from '@mcp-elements/react';

export function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
      <Drawer open={open} onOpenChange={setOpen} side="right">
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-3">
            <Input placeholder="Name" />
            <Input placeholder="Email" />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={() => setOpen(false)}>Save</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}
