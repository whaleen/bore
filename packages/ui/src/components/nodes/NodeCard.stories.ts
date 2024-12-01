// packages/ui/src/components/nodes/NodeCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import NodeCard from './NodeCard'
import type { Node } from './types'

const meta = {
  title: 'Nodes/NodeCard',
  component: NodeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeCard>

export default meta
type Story = StoryObj<typeof NodeCard>

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
  isPrimary: true,
}

export const Default: Story = {
  args: {
    node: sampleNode,
  },
}

export const Primary: Story = {
  args: {
    node: sampleNode,
    isPrimary: true,
  },
}

export const Inactive: Story = {
  args: {
    node: {
      ...sampleNode,
      isActive: false,
    },
  },
}

export const WithActions: Story = {
  args: {
    node: sampleNode,
    showActions: true,
    onSave: () => console.log('Save clicked'),
    onSetPrimary: () => console.log('Set Primary clicked'),
  },
}

export const NoActions: Story = {
  args: {
    node: sampleNode,
    showActions: false,
  },
}
