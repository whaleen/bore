// packages/ui/src/components/theme/ThemeToggle.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from './ThemeToggle'

const meta = {
  component: ThemeToggle,
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Current theme state'
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback when theme is toggled'
    }
  }
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {
  args: {
    theme: 'light',
  }
}
