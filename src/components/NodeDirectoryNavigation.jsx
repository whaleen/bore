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
      <div className='flex gap-2 p-1 bg-gray-800 rounded-lg w-fit'>
        <button
          onClick={() => handleFilterChange('status', 'all')}
          className={`px-4 py-2 rounded-md transition ${
            filters.status === 'all'
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All Nodes
        </button>
        <button
          onClick={() => handleFilterChange('status', 'active')}
          className={`px-4 py-2 rounded-md transition ${
            filters.status === 'active'
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => handleFilterChange('status', 'inactive')}
          className={`px-4 py-2 rounded-md transition ${
            filters.status === 'inactive'
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Inactive
        </button>
      </div>

      <div className='flex gap-4 flex-wrap md:flex-nowrap'>
        {/* Search Field */}
        <div className='relative flex-1 min-w-[200px]'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            size={20}
          />
          <input
            type='text'
            placeholder='Search by name, country, or region...'
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
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
