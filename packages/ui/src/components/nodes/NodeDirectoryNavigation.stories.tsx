// packages/ui/src/components/nodes/NodeDirectoryNavigation.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { NodeDirectoryNavigation } from './NodeDirectoryNavigation'

const meta = {
  title: 'Nodes/NodeDirectoryNavigation',
  component: NodeDirectoryNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeDirectoryNavigation>

export default meta
type Story = StoryObj<typeof NodeDirectoryNavigation>

const sampleNodes = [
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
  }
]

export const Default: Story = {
  args: {
    nodes: sampleNodes,
    onFiltersChange: (filters) => console.log('Filters changed:', filters)
  }
}

export const WithInitialFilters: Story = {
  args: {
    nodes: sampleNodes,
    initialFilters: {
      status: 'active',
      search: 'US',
      country: 'US'
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters)
  }
}

export const EmptyState: Story = {
  args: {
    nodes: [],
    onFiltersChange: (filters) => console.log('Filters changed:', filters)
  }
}
