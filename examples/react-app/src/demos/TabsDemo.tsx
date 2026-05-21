import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mcp-elements/react'

const tabItems = [
  { value: 'account' },
  { value: 'password' },
  { value: 'settings' },
]

export function TabsDemo() {
  return (
    <Tabs items={tabItems} defaultValue="account">
      {(api) => (
        <>
          <TabsList>
            <TabsTrigger
              isActive={api.value === 'account'}
              onClick={() => api.setValue('account')}
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              isActive={api.value === 'password'}
              onClick={() => api.setValue('password')}
            >
              Password
            </TabsTrigger>
            <TabsTrigger
              isActive={api.value === 'settings'}
              onClick={() => api.setValue('settings')}
            >
              Settings
            </TabsTrigger>
          </TabsList>
          {api.value === 'account' && (
            <TabsContent>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </TabsContent>
          )}
          {api.value === 'password' && (
            <TabsContent>
              <p className="text-sm text-muted-foreground">
                Change your password and security options.
              </p>
            </TabsContent>
          )}
          {api.value === 'settings' && (
            <TabsContent>
              <p className="text-sm text-muted-foreground">
                Configure notifications and display preferences.
              </p>
            </TabsContent>
          )}
        </>
      )}
    </Tabs>
  )
}
