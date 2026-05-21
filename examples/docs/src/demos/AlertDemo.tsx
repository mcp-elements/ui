import { Alert, AlertTitle, AlertDescription } from '@mcp-elements/react';

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Alert variant="default">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>All done!</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
    </div>
  );
}
