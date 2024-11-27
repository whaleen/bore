import { useState } from 'react'
import { Search } from 'lucide-react'
import { getCountriesList } from '../utils/location'
import CountrySelect from './CountrySelect'

function NodeDirectoryNavigation({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    country: '',
  })

  const countries = getCountriesList()

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className='mb-6 space-y-4'>
      {/* Status Filters */}
      <div className='btn-group'>
        <button
          onClick={() => handleFilterChange('status', 'all')}
          className={`btn ${filters.status === 'all' ? 'btn-active' : ''}`}
        >
          All Nodes
        </button>
        <button
          onClick={() => handleFilterChange('status', 'active')}
          className={`btn ${filters.status === 'active' ? 'btn-active' : ''}`}
        >
          Active
        </button>
        <button
          onClick={() => handleFilterChange('status', 'inactive')}
          className={`btn ${filters.status === 'inactive' ? 'btn-active' : ''}`}
        >
          Inactive
        </button>
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
            placeholder='Search by name, country, or region...'
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className='input input-bordered w-full pl-10'
          />
        </div>

        {/* Country Select */}
        <CountrySelect
          value={filters.country}
          onChange={(value) => handleFilterChange('country', value)}
          countries={countries}
        />
      </div>
    </div>
  )
}

export default NodeDirectoryNavigation
