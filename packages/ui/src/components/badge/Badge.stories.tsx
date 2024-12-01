// packages/ui/src/components/badge/Badge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Default Badge'
  }
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary'
  }
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success'
  }
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning'
  }
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error'
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  )
};
