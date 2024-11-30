// packages/ui/src/components/nodes/PrimaryNode.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { PrimaryNode } from './PrimaryNode'

const meta = {
  component: PrimaryNode,
  argTypes: {
    node: {
      description: 'Node data object or null if no primary node'
    }
  }
} satisfies Meta<typeof PrimaryNode>

export default meta
type Story = StoryObj<typeof PrimaryNode>

export const WithNode: Story = {
  args: {
    node: {
      id: '1',
      name: "US East Node 1",
      country: "United States",
      region: "North America",
      protocol: "HTTPS",
      ipAddress: "123.45.67.89",
      port: 8080,
      isPrimary: true
    }
  }
}

export const NoNode: Story = {
  args: {
    node: null
  }
}
