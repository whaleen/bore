// packages/ui/.storybook/preview.ts
import type { Preview, ReactRenderer } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: 'light' },
        { name: 'dark', class: 'dark' },
      ],
    },
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
}

export default preview
