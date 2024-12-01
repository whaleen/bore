// apps/web/src/components/NodeDirectoryNavigation.jsx
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button, CountrySelect } from '@bore/ui'

export const NodeDirectoryNavigation = ({ onFiltersChange, nodes }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    country: '',
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className='mb-6 space-y-4'>
      {/* Status Filters */}
      <div className='flex gap-2'>
        <Button
          variant={filters.status === 'all' ? 'primary' : 'outline'}
          onClick={() => handleFilterChange('status', 'all')}
        >
          All Nodes
        </Button>
        <Button
          variant={filters.status === 'active' ? 'primary' : 'outline'}
          onClick={() => handleFilterChange('status', 'active')}
        >
          Active
        </Button>
        <Button
          variant={filters.status === 'inactive' ? 'primary' : 'outline'}
          onClick={() => handleFilterChange('status', 'inactive')}
        >
          Inactive
        </Button>
      </div>

      <div className='flex gap-4 flex-wrap md:flex-nowrap'>
        {/* Search Field */}
        <div className='relative flex-1 min-w-[200px]'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            size={20}
          />
          <input
            type='text'
            placeholder='Search by name or country...'
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className='input input-bordered w-full pl-10'
          />
        </div>

        {/* Country Select */}
        <CountrySelect
          value={filters.country}
          onChange={(value) => handleFilterChange('country', value)}
          countries={[
            { code: '', name: 'All Countries' },
            ...Array.from(new Set(nodes.map((node) => node.countryCode))).map(
              (code) => ({
                code,
                name: nodes.find((node) => node.countryCode === code).country,
              })
            ),
          ]}
        />
      </div>
    </div>
  )
}

export default NodeDirectoryNavigation
