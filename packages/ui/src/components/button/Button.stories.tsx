// packages/ui/src/components/button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',  // Move from 'Components/Button' to 'UI/Button'
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],  // Add this to enable automatic documentation
  argTypes: {
    label: {
      description: 'Button text content',
      control: 'text',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    onClick: {
      description: 'Click handler function',
      action: 'clicked'
    },
    icon: {
      description: 'Optional icon component',
    },
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    className: 'btn-primary',
  }
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    className: 'btn-secondary',
  }
};

export const WithIcon: Story = {
  args: {
    label: 'Button with Icon',
    className: 'btn-primary',
    icon: '→'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    className: 'btn-disabled',
    disabled: true
  }
};
