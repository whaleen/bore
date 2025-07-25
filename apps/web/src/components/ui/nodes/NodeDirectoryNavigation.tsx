// packages/ui/src/components/nodes/NodeDirectoryNavigation.tsx
import React from 'react'
import { Search } from 'lucide-react'
import { Button } from '../button/Button'
import { CountrySelect } from '../form/CountrySelect'
import { InputField } from '../form/InputField'

export interface NodeDirectoryNavigationProps {
  onFiltersChange: (filters: {
    status: 'all' | 'active' | 'inactive'
    search: string
    country: string
  }) => void
  nodes: {
    nodes: Array<{
      countryCode: string
      country: string
    }>
  }
  className?: string
  initialFilters?: {
    status?: 'all' | 'active' | 'inactive'
    search?: string
    country?: string
  }
}

export const NodeDirectoryNavigation = ({
  onFiltersChange,
  nodes,
  className = '',
  initialFilters = {
    status: 'all',
    search: '',
    country: ''
  }
}: NodeDirectoryNavigationProps) => {
  const [filters, setFilters] = React.useState({
    status: initialFilters.status || 'all',
    search: initialFilters.search || '',
    country: initialFilters.country || ''
  })

  const handleFilterChange = (
    key: 'status' | 'search' | 'country',
    value: string
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const countries = React.useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(nodes.nodes.map(node => node.countryCode))
    ).map(code => ({
      code,
      name: nodes.nodes.find(node => node.countryCode === code)?.country || code
    }))

    return [{ code: '', name: 'All Countries' }, ...uniqueCountries]
  }, [nodes])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex gap-2'>
        <Button
          label="All Nodes"
          onClick={() => handleFilterChange('status', 'all')}
          className={filters.status === 'all' ? 'btn-primary' : 'btn-outline'}
        />
        <Button
          label="Active"
          onClick={() => handleFilterChange('status', 'active')}
          className={filters.status === 'active' ? 'btn-primary' : 'btn-outline'}
        />
        <Button
          label="Inactive"
          onClick={() => handleFilterChange('status', 'inactive')}
          className={filters.status === 'inactive' ? 'btn-primary' : 'btn-outline'}
        />
      </div>

      <div className='flex gap-4 flex-wrap md:flex-nowrap'>
        <div className='relative flex-1 min-w-[200px]'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50'
            size={20}
          />
          <InputField
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder='Search by name or country...'
            className='pl-10'
          />
        </div>

        <CountrySelect
          value={filters.country}
          onChange={(value) => handleFilterChange('country', value)}
          countries={countries}
          className='w-full md:w-64'
        />
      </div>
    </div>
  )
}
