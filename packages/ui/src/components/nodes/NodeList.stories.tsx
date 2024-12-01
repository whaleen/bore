// packages/ui/src/components/nodes/NodeList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NodeList } from './NodeList';
import type { Node } from './types';

const meta = {
  title: 'Nodes/NodeList',
  component: NodeList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeList>;

export default meta;
type Story = StoryObj<typeof NodeList>;

const sampleNodes: Node[] = [
  {
    id: '1',
    name: 'US East Node',
    country: 'United States',
    countryCode: 'US',
    ipAddress: '192.168.1.1',
    protocol: 'HTTP',
    region: 'East Coast',
    supportsUDP: true,
    isActive: true,
    isPrimary: true

  },
  {
    id: '2',
    name: 'EU West Node',
    country: 'Germany',
    countryCode: 'DE',
    ipAddress: '192.168.1.2',
    protocol: 'HTTPS',
    region: 'Western Europe',
    supportsUDP: false,
    isActive: true,
    isPrimary: true
  },
  {
    id: '3',
    name: 'Asia Pacific Node',
    country: 'Japan',
    countryCode: 'JP',
    ipAddress: '192.168.1.3',
    protocol: 'SOCKS5',
    region: 'Asia Pacific',
    supportsUDP: true,
    isActive: false,
    isPrimary: true
  }
];

export const Default: Story = {
  args: {
    nodes: sampleNodes,
    onRemoveNode: (id) => console.log('Remove node:', id),
    onSetPrimary: (id) => console.log('Set primary:', id)
  }
};

export const WithPrimaryNode: Story = {
  args: {
    nodes: sampleNodes,
    primaryNodeId: '1',
    onRemoveNode: (id) => console.log('Remove node:', id),
    onSetPrimary: (id) => console.log('Set primary:', id)
  }
};

export const Empty: Story = {
  args: {
    nodes: []
  }
};
