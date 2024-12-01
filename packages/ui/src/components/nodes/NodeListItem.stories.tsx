// packages/ui/src/components/nodes/NodeListItem.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import NodeListItem from './NodeListItem';
import type { Node } from './types';

const meta = {
  title: 'Nodes/NodeListItem',
  component: NodeListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeListItem>;

export default meta;
type Story = StoryObj<typeof NodeListItem>;

const sampleNode: Node = {
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
};

export const Default: Story = {
  args: {
    node: sampleNode
  }
};

export const Primary: Story = {
  args: {
    node: sampleNode,
    isPrimary: true
  }
};

export const WithActions: Story = {
  args: {
    node: sampleNode,
    onRemove: () => console.log('Remove clicked'),
    onSetPrimary: () => console.log('Set Primary clicked')
  }
};

export const MultipleNodes: Story = {
  render: () => (
    <div className="space-y-2 w-[600px]">
      <NodeListItem
        node={sampleNode}
        isPrimary={true}
      />
      <NodeListItem
        node={{ ...sampleNode, id: '2', name: 'EU West Node', country: 'Germany', countryCode: 'DE' }}
        onSetPrimary={() => console.log('Set Primary clicked')}
        onRemove={() => console.log('Remove clicked')}
      />
      <NodeListItem
        node={{ ...sampleNode, id: '3', name: 'Asia Pacific Node', country: 'Japan', countryCode: 'JP', isActive: false }}
        onSetPrimary={() => console.log('Set Primary clicked')}
        onRemove={() => console.log('Remove clicked')}
      />
    </div>
  )
};
