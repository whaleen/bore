// packages/ui/src/components/toggle/ToggleSwitch.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleSwitch } from './ToggleSwitch'

const meta: Meta<typeof ToggleSwitch> = {
  component: ToggleSwitch,
  argTypes: {
    enabled: {
      control: 'boolean',
      description: 'Toggle state'
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback when toggle state changes'
    },
    label: {
      control: 'text',
      description: 'Optional label text'
    }
  }
}

export default meta
type Story = StoryObj<typeof ToggleSwitch>

export const Default: Story = {
  args: {
    enabled: false,
    label: 'Toggle Switch'
  }
}

export const Enabled: Story = {
  args: {
    enabled: true,
    label: 'Toggle Switch'
  }
}

export const NoLabel: Story = {
  args: {
    enabled: false
  }
}
