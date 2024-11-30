// packages/ui/src/components/nodes/SavedNodeList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { SavedNodeList } from './SavedNodeList'

// This must be a default export
const meta: Meta<typeof SavedNodeList> = {
  component: SavedNodeList,
  argTypes: {
    onSetPrimary: { action: 'setPrimary' },
    onRemoveNode: { action: 'removeNode' }
  }
};

export default meta;
type Story = StoryObj<typeof SavedNodeList>;

const mockNodes = [
  {
    id: '1',
    name: 'US East Node 1',
    country: 'United States',
    region: 'North America',
    protocol: 'HTTPS',
    ipAddress: '123.45.67.89',
    port: 8080,
    isPrimary: false
  },
  {
    id: '2',
    name: 'Singapore Node 1',
    country: 'Singapore',
    region: 'Asia',
    protocol: 'SOCKS5',
    ipAddress: '98.76.54.32',
    port: 1080,
    isPrimary: true
  }
];

export const WithNodes: Story = {
  args: {
    nodes: mockNodes
  }
};

export const Empty: Story = {
  args: {
    nodes: []
  }
};
