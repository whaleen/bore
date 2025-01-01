// packages/ui/src/components/nodes/PrimaryNode.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryNode } from './PrimaryNode';
import type { Node } from './types';

const meta = {
  title: 'Nodes/PrimaryNode',
  component: PrimaryNode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    node: {
      description: 'Node data object or null if no primary node is set',
      control: 'object'
    }
  }
} satisfies Meta<typeof PrimaryNode>;

export default meta;
type Story = StoryObj<typeof PrimaryNode>;

const sampleNode: Node = {
  id: '1',
  name: 'US East Node',
  country: 'United States',
  countryCode: 'US',
  ipAddress: '192.168.1.1',
  protocol: 'HTTP',
  port: 8080,
  region: 'East Coast',
  supportsUDP: true,
  isActive: true,
  isPrimary: true
};

export const WithNode: Story = {
  args: {
    node: sampleNode
  }
};

export const EmptyState: Story = {
  args: {
    node: null
  }
};

export const InactiveNode: Story = {
  args: {
    node: {
      ...sampleNode,
      isActive: false
    }
  }
};

export const WithLongName: Story = {
  args: {
    node: {
      ...sampleNode,
      name: 'US East Coast High-Performance Enterprise Proxy Node'
    }
  }
};
