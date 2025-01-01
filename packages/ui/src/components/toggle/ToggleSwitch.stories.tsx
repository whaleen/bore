// packages/ui/src/components/toggle/ToggleSwitch.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleSwitch } from './ToggleSwitch';

const meta = {
  title: 'UI/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    enabled: {
      description: 'Whether the toggle is on or off',
      control: 'boolean',
    },
    onToggle: {
      description: 'Toggle handler function',
      action: 'toggled'
    },
    label: {
      description: 'Optional label text',
      control: 'text'
    }
  }
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Default: Story = {
  args: {
    enabled: false,
    label: 'Toggle Feature'
  }
};

export const Enabled: Story = {
  args: {
    enabled: true,
    label: 'Feature Enabled'
  }
};

export const WithoutLabel: Story = {
  args: {
    enabled: false
  }
};

export const CustomSize: Story = {
  args: {
    enabled: false,
    label: 'Large Toggle',
    className: 'toggle-lg'
  }
};
