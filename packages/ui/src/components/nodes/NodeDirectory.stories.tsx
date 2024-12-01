// packages/ui/src/components/nodes/NodeDirectory.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NodeDirectory } from './NodeDirectory';
import type { Node } from './types';

const meta = {
  title: 'Nodes/NodeDirectory',
  component: NodeDirectory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeDirectory>;

export default meta;
type Story = StoryObj<typeof NodeDirectory>;

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
    onSaveNode: (id) => console.log('Save node:', id),
    onSetPrimary: (id) => console.log('Set primary:', id)
  }
};

export const WithFilters: Story = {
  args: {
    nodes: sampleNodes,
    filters: {
      status: 'active',
      country: 'US'
    },
    onSaveNode: (id) => console.log('Save node:', id),
    onSetPrimary: (id) => console.log('Set primary:', id)
  }
};

export const SearchFiltered: Story = {
  args: {
    nodes: sampleNodes,
    filters: {
      search: 'east'
    },
    onSaveNode: (id) => console.log('Save node:', id),
    onSetPrimary: (id) => console.log('Set primary:', id)
  }
};
