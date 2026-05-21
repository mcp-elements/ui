import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [
    starlight({
      title: 'mcp-elements',
      social: {
        github: 'https://github.com/thepsygeek/mcp-elements',
      },
      customCss: ['./src/styles/global.css'],
      components: {
        ThemeSelect: './src/components/ThemeToggle.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Home', slug: '' },
            { label: 'All Components', slug: 'all-components' },
            { label: 'Getting Started', slug: 'getting-started' },
            { label: 'Installation', slug: 'installation' },
            { label: 'CLI', slug: 'cli' },
            { label: 'Theming', slug: 'theming' },
          ],
        },
        {
          label: 'Form',
          items: [
            { label: 'Button', slug: 'components/button' },
            { label: 'Input', slug: 'components/input' },
            { label: 'Textarea', slug: 'components/textarea' },
            { label: 'Password Input', slug: 'components/password-input' },
            { label: 'Select', slug: 'components/select' },
            { label: 'Switch', slug: 'components/switch' },
            { label: 'Counter', slug: 'components/counter' },
          ],
        },
        {
          label: 'Display',
          items: [
            { label: 'Badge', slug: 'components/badge' },
            { label: 'Card', slug: 'components/card' },
            { label: 'Avatar', slug: 'components/avatar' },
            { label: 'Separator', slug: 'components/separator' },
            { label: 'Skeleton', slug: 'components/skeleton' },
            { label: 'Progress', slug: 'components/progress' },
            { label: 'Loader', slug: 'components/loader' },
          ],
        },
        {
          label: 'Overlay',
          items: [
            { label: 'Dialog', slug: 'components/dialog' },
            { label: 'Tooltip', slug: 'components/tooltip' },
            { label: 'Popover', slug: 'components/popover' },
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Drawer', slug: 'components/drawer' },
          ],
        },
        {
          label: 'Navigation',
          items: [
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Accordion', slug: 'components/accordion' },
            { label: 'Dropdown Menu', slug: 'components/dropdown-menu' },
          ],
        },
        {
          label: 'Feedback',
          items: [
            { label: 'Alert', slug: 'components/alert' },
            { label: 'Chips', slug: 'components/chips' },
          ],
        },
        {
          label: 'AI',
          items: [
            { label: 'Prompt Input', slug: 'components/prompt-input' },
            { label: 'Chat Bubble', slug: 'components/chat-bubble' },
            { label: 'AI Badge', slug: 'components/ai-badge' },
            { label: 'Suggestion Chips', slug: 'components/suggestion-chips' },
            { label: 'Source Card', slug: 'components/source-card' },
            { label: 'Streaming Text', slug: 'components/streaming-text' },
            { label: 'Feedback', slug: 'components/feedback' },
          ],
        },
      ],
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
